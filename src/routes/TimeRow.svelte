<script lang="ts">

  //First just name everything with strings
  export let label :String
  export let slots :Number

</script>

<div class="row" >

  <div class="labelBox">
    <span>{label}</span>
  </div>

  <div class="slots">
    
    <!-- Slots are for visual reference. Bars will be relative to parent slots. Well wrry about indexin them later -->
    {#each Array(slots) as _, i }
      <div class={ 'slot ' +  ( i % 2 ? 'dark' : 'light' ) } style="width: calc( 100% / {slots} );"></div>
    {/each}

    <!-- For showing the time bars -->
    <slot/>

  </div>

</div>

<style>
  .row {
    display: flex;
    width: 100%;
    border: rgba(1, 1, 1, 0) 2px dashed;
  }

  .row:hover {
    border: blue 2px solid;
  }

  .labelBox{
    width: 10em;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: 1em;
  }

  .slots {
    display: flex;
    width: 100%;
  }

  .slot {
    height: 2.5em;
  }

  .light{
    background-color: #D9D9D9;
  }

  .dark{
    background-color: #E6F7FF;
  }
</style>