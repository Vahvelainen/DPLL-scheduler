<script lang="ts">
  import type {Project, Step} from './types'
  import TimeRow from "./TimeRow.svelte";
  import ProjectTable from "./ProjectTable.svelte";

  //First just name everything with strings
  let resources : Array<String>  = [
    'A',
    'B',
    'C',
  ]

  //Number of timeslots, could be adjustable or base on different views
  const t_num = 7

  //Two projects for starters to get the game going
  let projectA :Project = {
      name: 'Project A',
      steps: [
        { name: 'Step 1', resource: 'A', duration: 1 },
        { name: 'Step 2', resource: 'C', duration: 2 },
        { name: 'Step 3', resource: 'B', duration: 2 },
        { name: 'Step 4', resource: 'D', duration: 1 },
      ]
    }

  let projectB :Project = {
      name: 'Project B',
      steps: [
        { name: 'Step 1', resource: 'A', duration: 1 },
        { name: 'Step 2', resource: 'C', duration: 2 },
        { name: 'Step 3', resource: 'B', duration: 2 },
        { name: 'Step 4', resource: 'D', duration: 1 },
      ]
    }

</script>

<h1>DPLL scheduler</h1>
<p>Arrange the use of resources</p>

{#each resources as resource, i}
  <TimeRow label={resource} slots={t_num}>
    <!-- The time reservations ought to be displayed here -->
  </TimeRow>
{/each}

<ProjectTable project={projectA} />
<ProjectTable project={projectB} />