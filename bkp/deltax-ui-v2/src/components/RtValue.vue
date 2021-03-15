<template>
<div>  
  <div  v-if="value == '-' " >
    <div class="py-1 px-2 text-red-600" >
       ----
      </div>  
  </div>  
  <div v-else>
    <div :key="value" class="font-bold">
      <div class="animate-color py-1 px-2" :class="classError" >
        {{value}}
      </div>  
    </div>
  </div> 
</div> 
</template>
 
<script>
import RtWs from "../services/RtWs";

export default {
  name:"RtValue",
  props: { 
    topicName: { 
      require:true,
      type: String,
    }
  },

  data() {
    return {  };
  },

  mounted() {
    // console.log("--- MOUNTED --- topicName",this.topicName)
     
    RtWs.RtAddSubscribe([this.topicName]); 
  },

  computed:{
    value()  {
      // console.log("this.topicName",this.topicName);
      const topic = RtWs.Topics[this.topicName] || null;
      return topic?.status === true || topic?.value  != "" 
        ? topic?.value ?? '-'  
        : '-'; 
    },

    status()  { 
      return RtWs.IsConnected && RtWs.Topics[this.topicName]?.status;
    },

    classError()  { 
      return this.status ? "" : "line-through text-red-600"; 
    }
  }  
}
</script>


<style>    
.animate-color {
  animation-name: mymove;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: none;
  animation-play-state: running;
}

@keyframes mymove {
  from { 
    background-color: rgba(53, 128, 158, 0.856); 
     --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  to {
    background-color: transparent;  
  }
}
</style>
