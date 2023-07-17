<script>
  export let xScale;
  export let width;
  export let height;
  export let margin;

  $: ticks = xScale.ticks(6);
</script>

<g class="axis x">
  {#each ticks as tick}
    <g class="tick" transform="translate({xScale(tick)}, 0)">
      <text x="0" y={height} text-anchor="middle">{tick}%</text>
      <line x1="0" x2="0" y1="0" y2={height} stroke="hsla(215, 15%, 91%, 1)" />
    </g>
  {/each}
  <text
    class="axis-title axis-background"
    x={width}
    y={height}
    dy="-45"
    dominant-baseline="hanging"
    text-anchor="end"
  >
    percentage of seats held by women &rarr;
  </text>
</g>
