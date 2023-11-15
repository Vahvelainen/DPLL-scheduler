<script lang="ts">
  import TimeRow from "./TimeRow.svelte";

  //First just name everything with strings
  let resources : Array<String>  = [
    'Resource A',
    'Resource B',
    'Resource C',
  ]

  //Number of timeslots, could be adjustable
  const t_num = 7

</script>

<h1>DPLL scheduler</h1>
<p>Arrange the use of resources</p>

{#each resources as resource, i}
  <TimeRow label={resource} slots={t_num}>
    <!-- The time reservations ought to be displayed here -->
  </TimeRow>
{/each}