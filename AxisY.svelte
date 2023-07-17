<script>
  import { fade } from "svelte/transition";
  export let yScale;
  export let groupByContinent;

  $: ticks = yScale.domain();
</script>

<g class="axis y">
  {#each ticks as tick, index}
    {#if groupByContinent}
      <g
        class="tick"
        in:fade={{ delay: index * 100 }}
        out:fade={{ duration: 200 }}
      >
        <text class="axis-background" y={yScale(tick)}>{tick}</text>
      </g>
    {/if}
  {/each}
</g>

<style>
  .axis-background {
    background: var(--shaft);
    padding: 1rem;
    border-radius: 12px;
  }
</style>
