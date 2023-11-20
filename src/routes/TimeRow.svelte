<script lang="ts">
  import type {Timing} from './types'

  //First just name everything with strings
  export let label :String
  export let slots :Number
  export let timings: Timing[]

</script>

<div class="row" >

  <div class="labelBox">
    <span>Resource {label}</span>
  </div>

  <div class="slots">
    
    <!-- Slots are for visual reference. Bars will be relative to parent slots. Well wrry about indexin them later -->
    {#each Array(slots) as _, i }
      <div class={ 'slot ' +  ( i % 2 ? 'dark' : 'light' ) } style="width: calc( 100% / {slots} );">
        <!-- Doing this like this for now, not ok in the future I think -->
        <!-- Should only ever be one per index but doing this with each to fing bugs easier -->
        {#each timings.filter( timing => timing.time === i ) as timing}
          <div>
            <span>Step {timing.step}</span>
            <span>Project {timing.project}</span>
          </div>
        {/each}
      </div>
    {/each}

  </div>

</div>

<style>
  .row {
    display: flex;
    width: 100%;
    margin-bottom: 0.2em;
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