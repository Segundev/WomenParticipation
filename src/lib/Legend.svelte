<script>
  export let colorScale;
  export let hoveredContinent;
</script>

<div class="legend">
  {#each colorScale.domain() as continent}
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
  }

  span {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
</style>
