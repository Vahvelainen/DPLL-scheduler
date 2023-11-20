<script lang="ts">
  export let value: Number
  let editing: boolean = false
  let input: HTMLInputElement

  function startEdit() {
    setTimeout( () =>  window.addEventListener('click', stopEdit) )
    editing = true
  }

  function stopEdit(event: Event) {
    if (event.target === input) {
      return
    }
    window.removeEventListener('click', stopEdit)
    editing = false
  }


</script>

{#if editing} 
  <input type="number" min="1" bind:value bind:this={input}>
{:else}
  <span on:click={startEdit}>{value}</span>
{/if}