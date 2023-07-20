<script>
  export let xScale;
  export let width;
  export let height;
  export let margin;

  /*  $: {
    if (width < 260) {
      ticks = xScale.ticks(4);
    } else {
      ticks = xScale.ticks(6);
    }
  } */
  $: ticks = width < 360 ? xScale.ticks(4) : xScale.ticks(6);
  $: console.log(ticks);
</script>

<g class="axis x">
  {#each ticks as tick}
    <g class="tick" transform="translate({xScale(tick)}, 0)">
      <line x1="0" x2="0" y1="0" y2={height - 20} stroke="var(--whitesmoke)" />
      <text x="0" y={height} text-anchor="middle">{tick}%</text>
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
