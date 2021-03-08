<template> 
    <table class="relative overflow-x-auto | shadow text-sm w-full">
        <thead class="sticky top-0 | items-center bg-gray-200 shadow">
            <slot name="header">
                <th v-for="col in columnsObj" 
                    :key="col.field" 
                    class="p-1 pl-3 capitalize font-bold text-left text-gray-700"
                    v-bind="{...col}"
                >
                    <slot :name="`header.${col.field}`"> 
                        {{col.label}}
                    </slot>
                </th>
            </slot>
        </thead>
        <tbody>
            <template v-for="(row, idx) in rows"> 
                <slot name="row" v-bind:row="row" >
                    <tr :key="idx"
                        class="border-gray-200 dark:border-gray-400 border-t border-b px-3" >
                        <template v-for="col in columnsObj">
                            <td :key="col.field" :class="col.tdclass" >
                                <slot :name="`row.${col.field}`" v-bind:row="row">
                                    <div v-html="col.oninput !=null ? col.oninput(row[col.field]) : row[col.field]" />
                                </slot>
                            </td> 
                        </template>
                    </tr> 
                </slot>
            </template>
        </tbody>
    </table>  
</template>

<script >
export default {
    props: {
        columns: {   
            type: String,
            require: true
        },
        url: {
            type: String,
        }, 
    },

    data() {
        return {
            // columns:[
            //     {
            //         label:"Label",
            //         field:"field",
            //         class:"w-4/6",
            //         value: (v) => v, 
            //     }, 
            // ],
            rows:[
                { 
                    "field":"123456", 
                    "field2":"123", 
                    "field3":"123", 
                } 
            ]   
        };
    },   
 
    computed:{
        columnsObj() {
            
            if(this.columns)
            {  
                return typeof(this.columns) == 'string' 
                    ? JSON.parse(this.columns)
                    : this.columns;  
            }
            
            const cols = []
            this.$slots.default?.forEach(s => {
                console.log("+ slot", s.tag, s.data.domProps.innerHTML, s.data.attrs) 
                cols.push({
                    ...s.data.attrs,  
                    oninput: s.data.attrs.oninput ? eval(s.data.attrs.oninput) : null,
                    label: s.data.domProps.innerHTML 
                })
            });
            return cols;

        }
    } 
}
</script>

<style>

</style>