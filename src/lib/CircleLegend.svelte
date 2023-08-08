<script>
  import { scaleBand } from "d3-scale";
  export let radiusScale;
  export let width;
  export let height;
  export let margin;
  const svgWidth = 100;
  const svgHeight = 70;

  const data = [5009397, 20149552, 100720501, 373757123];
  const data2 = [
    { label: "5 Million", size: "5009397" },
    { label: "20 Million", size: "20149552" },
    { label: "100 Million", size: "100720501" },
    { label: "4 Billion", size: "373757123" },
  ];

  $: xScale = scaleBand().domain(data).range([0, width]);
</script>

<svg {width} height={svgHeight}>
  <text x={10} dy={10}> The size of Circle represent Female population </text>
  <g class="CircleLegend" transform="translate({margin.left - 30},25)">
    {#each data2 as d}
      <circle
        r={radiusScale(+d.size)}
        cx={xScale(+d.size)}
        fill="#f9f9f9"
        stroke="#00000090"
      />
      <text
        x={xScale(+d.size)}
        dominant-baseline="hanging"
        text-anchor="middle"
        dy="25"
      >
        {d.label}
      </text>
    {/each}
  </g>
</svg>

<style>
  text {
    font-size: 12px;
    fill: rgba(165, 165, 165, 0.867);
  }
  p {
    text-align: center;
    font-size: 10px;
    color: var(--raven);
  }
</style>
