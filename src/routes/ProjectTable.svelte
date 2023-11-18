<script lang="ts">

  import type {Project, Step} from './types'

  export let project :Project = {
    name: 'Project A',
    steps: [
      { name: 'Step 1', resource: 'A', duration: 1 },
      { name: 'Step 2', resource: 'C', duration: 2 },
      { name: 'Step 3', resource: 'B', duration: 2 },
      { name: 'Step 4', resource: 'D', duration: 1 },
    ]
  }

</script>


<table>
  <tr>
    <th>{project.name} terms</th>
    <th>Resource</th>
    <th>Duration</th>
  </tr>
  {#each project.steps as step, i }
    <tr>
      <td>{step.name}</td>
      <td>{step.resource}</td>
      <td>{step.duration}</td>
    </tr>
  {/each}
</table>