<script lang="ts">
  export let value: string
  export let choises: string[]
  let editing: boolean = false
  let select: HTMLSelectElement

  function startEdit() {
    setTimeout( () =>  window.addEventListener('click', stopEdit) )
    editing = true
  }

  function stopEdit(event: Event) {
    if (event.target === select) {
      return
    }
    window.removeEventListener('click', stopEdit)
    editing = false
  }

</script>

{#if editing} 
  <select bind:value bind:this={select}>
    {#each choises as choise}
      <option value={choise}>{choise}</option>
    {/each}
  </select>
{:else}
  <span on:click={startEdit}>{value}</span>
{/if}

