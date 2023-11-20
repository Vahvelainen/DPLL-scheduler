<script lang="ts">
  import TextMutable from './TextMutable.svelte';
  import ChoiceMutable from './ChoiceMutable.svelte';
  import NumberMutable from './NumberMutable.svelte';
  import type {Project, Step} from './types'
  export let project: Project
  export let resources: string[]
</script>

<table>
  <tr>
    <th>{project.name} terms</th>
    <th>Resource</th>
    <th>Duration</th>
  </tr>
  {#each project.steps as step, i }
    <tr>
      <td><TextMutable bind:value={step.name}/></td>
      <td><ChoiceMutable bind:value={step.resource} choises={resources}/></td>
      <td><NumberMutable bind:value={step.duration}/></td>
    </tr>
  {/each}
</table>