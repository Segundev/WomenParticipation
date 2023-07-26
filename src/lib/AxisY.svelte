<script>
  import { fade } from "svelte/transition";
  export let yScale;
  export let groupByContinent;

  $: ticks = yScale.domain();
</script>

<g class="axis y">
  {#each ticks as tick, index}
    <g
      class="tick"
      in:fade={{ delay: index * 200 }}
      out:fade={{ duration: 200 }}
    >
      <text class="axis-background" y={yScale(tick)}>{tick}</text>
    </g>
  {/each}
</g>

<style>
  .axis-background {
    background: var(--shaft);
    padding: 1rem;
    border-radius: 12px;
  }
</style>
