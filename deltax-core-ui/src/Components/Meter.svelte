<svelte:options tag={"dx-meter"} />

<script >
    export let topicname;
    export let name;
    export let unit;
    export let color;

    if (!color)
        color = "gray";
    if(!name)
        name= "---";

</script>

<div class="grid overflow-hidden shadow-mb-xl bg-gray-800 hover:bg-black"> 
    <div class="text-center flex-row self-center"> 
      <span class="text-5xl font-bold font-sans break-all text-{color}-300 ">
        <dx-rt-value topicname={topicname}></dx-rt-value>
        </span>
        {#if unit }
            <span class="font-sans font-bold text-{color}-300" >
            {unit}
            </span>
        {/if}
    </div>
    <div class="p-1 self-center text-center font-bold text-gray-300">
        {name}
    </div>
</div>
  
<style>
    @import "/global.css";
</style>
