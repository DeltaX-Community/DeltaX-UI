<template> 
  <div class="flex flex-row items-stretch overflow-hidden | rounded-md border-2 border-blue-600" >
    <div class="w-1/3 py-1 px-2 bg-blue-600 text-white font-bold">
        {{name || topicname}}
    </div>   
      <div class="flex-grow auto-cols-max font-bold"> 
        <rt-value :topicName="topicName"></rt-value>
      </div> 
      <div class="py-1 px-2">
        {{unit || ""}}
      </div>
  </div> 
</template>
 
<script  >   
import RtValue from "./RtValue.vue";

export default {
  components:{
    RtValue
  },
  props: {
    name: {
      type: String,
    },
    topicName: { 
      require:true,
      type: String,
    },
    unit: {
      type: String,
    }
  },

  data() {
    return {  };
  }
}
</script>
 
