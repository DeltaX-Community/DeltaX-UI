<template> 
    <div
      ref="echarts" 
      style="width: 100%; min-width: 300px; min-height:200px; height: 100%;" 
    /> 
</template> 

<script>
import * as echarts from 'echarts'; 
import {ChartOptions} from "./RtOptions"
 

export default {
    data() {
        return {
            timer: null,
            chart: null,
            option: new ChartOptions()
        }
    },

    beforeDestroy(){
        clearInterval(this.timer); 
        this.timer = null;
    },

    methods:{
        initChart(el){ 
            this.chart = echarts.init(el, null, {renderer: 'svg'}); 
 
            let base = new Date() - 4*3600*1000; 
            const data =  [
                [ new Date(base += 3600*1000), 150], 
                [ new Date(base += 3600*1000), 230], 
                [ new Date(base += 3600*1000), 224], 
                [ new Date(base += 3600*1000), 218], 
                [ new Date(base += 3600*1000), 135], 
                [ new Date(base += 3600*1000), 147], 
                [ new Date(base += 3600*1000), 260],
                [ new Date(base += 3600*1000), 160],
                [ new Date(base += 3600*1000), 270],
                [ new Date(base += 3600*1000), 271],
                [ new Date(base += 3600*1000), 263],
                [ new Date(base += 3600*1000), 268]
            ]
            this.option.addSerie("Prueba 1", data ) 
 
            this.option.addSerieString("Prueba String", [] ) 
            this.option.addSerieString("Prueba String2", [] ) 

            this.chart.setOption(this.option.get());
        },

        TestSerie(){ 
            const value= "pepe"
            const updated = new Date()

            let serie = this.option.get().series.find(s => s.id == "Prueba String") 
            serie.data.push({
                value: [updated, serie.textYPosition],
                name: `Value: ${value}\nAt ${new Date(updated).toISOString()}`,
                data: value
              });

            serie = this.option.get().series.find(s => s.id == "Prueba String2") 
            serie.data.push({
                value: [updated, serie.textYPosition],
                name: `Value: ${value}\nAt ${new Date(updated).toISOString()}`,
                data: value
            });
        },

       async updateValues(){ 
           this.TestSerie()
            // let self = this;
            // let allSeries = [];
            // allSeries.push({
            //     id: serie.id,
            //     data: serie.data
            // });
            this.chart.setOption({
                series: this.option.get().series
            }); 
        }
    },

    mounted(){
        console.log("chart mounted ")
        this.initChart(this.$refs.echarts) 

        this.$nextTick(() =>  this.updateValues() )
    }
}
</script>
 