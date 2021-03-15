<template> 
    <div
      ref="echarts" 
      style="width: 100%; min-width: 300px; min-height:200px; height: 100%;" 
    /> 
</template> 

<script>
import * as echarts from 'echarts'; 
import {ChartOptions} from "./RtOptions" 
import { GetTopicHistory } from "../../api/request";
import RtWs from '@/services/RtWs';
// import RtWs from "../../services/RtWs" 

export default {
    props: {
        baseUrl: {
            type: String,
            default: 'http://127.0.0.1:5010/api/v1'
        },
        tags: {
            type: String
        },
        beginDateTime: {
            type: [Date],
            default: null
        },
        endDateTime: {
            type: [Date],
            default: null
        },
        realTime: {
            type: [Boolean],
            default: false
        }
    },

    data() {
        return {
            timer: null,
            chart: null,
            option: null
        }
    },

    computed:{
        queryParams(){
            const params = {
                beginDateTime : new Date( this.beginDateTime),
                endDateTime: new Date(this.endDateTime),  
                maxPoints: 1000,
                lastSeconds: 90,
                strictMode: false,
            } 
            if(!this.beginDateTime || !this.endDateTime)
            {
                params.endDateTime= new Date()
                params.beginDateTime = new Date( +params.endDateTime - (+params.lastSeconds* 1000) )
            } 
            return params; 
        }, 
    }, 

    beforeDestroy(){
        console.log("*** Destroy *** ", this.tags)
        this.chart.dispose()
        clearInterval(this.timer);  
        this.timer = null;
    }, 
    
    watch: {
        tags: {
            immediate: false,
            handler: function (tags) {
                if (tags) {
                    const tagsObj = JSON.parse(tags)
 
                    if(this.realTime)
                    {
                        if(RtWs.IsConnected)
                        { 
                            this.$nextTick(() => this.initChart(this.$refs.echarts, tagsObj)) 
                        } 
                     
                        RtWs.on("rt.connected", () => {
                            this.initChart(this.$refs.echarts, tagsObj)
                        }); 
                    }
                    else{
                        this.$nextTick(() => this.initChart(this.$refs.echarts, tagsObj)) 
                    }
                } 
            },
        },
    },

    methods:{
        async initChart(el, tags){
            console.log("initChart", el, tags)
            this.option = new ChartOptions()
            this.chart = echarts.init(el); 
            // this.chart.setOption(this.option.get(), true);  
            
            if(this.realTime) {
                const topics = tags.map(t=>t.tagName) 
                await RtWs.RtAddSubscribe(topics)  
            } 
            
            for (const t of tags) { 
                await this.addSerie(t.name, t.tagName, t.axisName, t.options) 
            } 
 
            // console.log(" *********** ** * ** * * setOption()",JSON.stringify(this.option.get(),null, 4))
            this.chart.setOption(this.option.get(), true);  
 
            await this.loadSeries()
        
            if(this.realTime) {
                this.timer = setInterval(this.updateValuesAllSeries, 1000)
            }  
        }, 

        async addSerie(name, tagName="process_info/UI.RtViewer/AliveMs", axisName=' ', options={}){ 
            let lastValue = ''
            if(this.realTime){ 
                lastValue = RtWs.Topics[tagName].value
            } else {
                const resLastValue = await GetTopicHistory(this.baseUrl, tagName, { 
                    endDateTime: this.queryParams.endDateTime, 
                    lastSeconds: 1, 
                    strictMode: false
                    })  
                lastValue = resLastValue[resLastValue.length-1].value
            }

            // Serie Numeric
            if( lastValue !=='' &&  !isNaN(lastValue)  ) {   
                this.option.addSerie(name, [] ,axisName, {...options, tagName}) 
            }
            // Serie String 
            else{   
                this.option.addSerieString(name, [], {...options, tagName, lastValue})  
            } 
        }, 

        async loadSeries(){
            const series = this.option.get().series
            for (const serie of series) {  
                if(!serie.tagName) {
                    continue
                } 
                const tagName = serie.tagName;  
 
                // Serie Numeric
                if(serie.isNumeric) { 
                    const res = await GetTopicHistory(this.baseUrl, tagName, {...this.queryParams, strictMode :true}) 
                    serie.data.extend(res.map(e => {  return [ Date.parse(e.updated),  e.value ]})) 
                }
                // Serie String 
                else{ 
                    const res = await GetTopicHistory(this.baseUrl, tagName, {...this.queryParams, strictMode :false})  
                    serie.data.extend(res.map( e => {   
                        return {
                            value: [ Date.parse(e.updated),  serie.textYPosition ],
                            name: `Value: ${e.value}\nAt ${e.updated}`,
                            data: e.value
                        } 
                    }))    
                }
            } 

            this.chart.setOption({
                series: series
            });
        }, 
        
        updateValuesAllSeries(){
            const now = Date.now() 

            for (const serie of this.option.get().series) {  
                if(!serie.tagName) {
                    continue
                }

                const tagName = serie.tagName; 
                const tag = RtWs.Topics[tagName] 

                // Numeric
                if(serie.isNumeric) {  
                    serie.data.push([ now,  tag.value ]); 
                }
                // String
                else if(tag.value != serie.lastValue)
                {  
                    serie.data.push({
                        value: [ now,  serie.textYPosition ],
                        name: `Value: ${tag.value}\nAt ${tag.updated}`,
                        data: tag.value
                    });
                    serie.lastValue = tag.value;
                }
            }

            this.chart.setOption({
                series: this.option.get().series
            });
        },  
    },

}
</script>
 