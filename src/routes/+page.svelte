<script lang="ts">

  import { onMount } from 'svelte'
  import solveSchedule from './scheduler';
  import type {Project, Step, Timing} from './types'
  import TimeRow from "./TimeRow.svelte";
  import ProjectTable from "./ProjectTable.svelte";

  let resources: string[]  = [ 'A', 'B', 'C', 'D' ]
  let timings: Timing[] = [] 

  //Number of timeslots, could be adjustable or base on different views
  const t_num = 7

  //Two projects for starters to get the game going
  let projectA :Project = {
      name: 'A',
      steps: [
        { name: '1', resource: 'A', duration: 1 },
        { name: '2', resource: 'C', duration: 2 },
        { name: '3', resource: 'B', duration: 2 },
        { name: '4', resource: 'D', duration: 1 },
      ]
    }

  let projectB :Project = {
      name: 'B',
      steps: [
        { name: '1', resource: 'B', duration: 2 },
        { name: '2', resource: 'C', duration: 2 },
        { name: '3', resource: 'C', duration: 1 },
        { name: '4', resource: 'B', duration: 1 },
      ]
    }

    function schedule() {
      const responseSchedule = solveSchedule([projectA, projectB], resources)
      if (!responseSchedule) { return }
      timings = []
      for( const timingStr of responseSchedule) {
        const timingArr = timingStr.split('_')
        timings.push({
          resource: timingArr[0].replace('Resource', ''),
          time: parseInt(timingArr[1].replace('Time', '')),
          project: timingArr[2].replace('Project', ''),
          step: timingArr[3].replace('Step', ''),
        })
      }
    }

    //onMount(schedule)

</script>

<h1>DPLL scheduler</h1>
<p>Arrange the use of resources</p>

{#each resources as resource, i}
  <TimeRow label={resource} slots={t_num} timings={timings.filter( timing => timing.resource === resource )}>
  </TimeRow>
{/each}

<button on:click={schedule}>Re-schedule</button>

<ProjectTable bind:project={projectA} resources={resources}/>
<ProjectTable bind:project={projectB} resources={resources}/>