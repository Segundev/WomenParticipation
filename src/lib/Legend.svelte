<script>
  export let colorScale;
  export let hoveredContinent;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="legend" on:mouseleave={() => (hoveredContinent = null)}>
  {#each colorScale.domain() as continent}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <p
      class:unhovered={hoveredContinent && hoveredContinent !== continent}
      on:mouseover={() => (hoveredContinent = continent)}
    >
      <span style="background: {colorScale(continent)}" />
      {continent}
    </p>
  {/each}
</div>

<style>
  .legend {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap: 5px;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    column-gap: 5px;
    font-weight: 600;
    color: var(--mako);
  }
  p.unhovered {
    opacity: 0.3;
  }
  span {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
  }
</style>
