<script>
  import AxisX from "$lib/AxisX.svelte";
  import AxisY from "$lib/AxisY.svelte";
  import Legend from "$lib/Legend.svelte";
  import data from "$lib/data.json";
  import { mean, rollups, extent } from "d3-array";
  import { fade } from "svelte/transition";
  import {
    forceSimulation,
    forceX,
    forceY,
    forceCollide,
    forceManyBody,
  } from "d3-force";
  import { scaleLinear, scaleBand, scaleOrdinal, scaleSqrt } from "d3-scale";
  import Tooltip from "$lib/Tooltip.svelte";
  // write a code that takes the original data and input either lower or upper chamber
  let filteredData = data.filter((d) => d.Lower_Percentage !== null);

  let width = 400;
  let height = 500;

  const margin = { top: 0, right: 90, bottom: 0, left: 90 };

  $: innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  const continents = rollups(
    data.filter((d) => d.Lower_Percentage !== "Nan"),
    (v) => mean(v, (d) => d.Lower_Percentage),
    (d) => d.Region
  )
    .sort((a, b) => a[1] - b[1])
    .map((d) => d[0]);

  const colorRange = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
  ];

  let colorScale = scaleOrdinal()
    .domain(continents) // continents was already defined in our code
    .range(colorRange);

  $: xScale = scaleLinear()
    .domain([0, 62]) // Alternatively, we could pass .domain(extent(data, d => d.happiness))
    .range([0, innerWidth]);

  let radiusScale = scaleSqrt()
    .domain(extent(filteredData, (d) => d.Fem_Pop))
    .range([6, 24]);

  let yScale = scaleBand()
    .domain(continents)
    .range([innerHeight, 0])
    .paddingOuter(0.5);

  let simulation = forceSimulation(filteredData);
  let nodes = [];
  simulation.on("tick", () => {
    nodes = simulation.nodes();
  });
  $: console.log(innerWidth);
  $: {
    simulation
      .force(
        "x",
        forceX()
          .x((d) => xScale(d.Lower_Percentage))
          .strength(0.8)
      )
      .force(
        "y",
        forceY()
          .y((d) => (groupByContinent ? yScale(d.Region) : innerHeight / 2))
          .strength(0.5)
      )
      .force(
        "collide",
        forceCollide().radius((d) => radiusScale(d.Fem_Pop))
      )
      .force("charge", forceManyBody().strength(-5))
      .alpha(0.3) // [0, 1] The rate at which the simulation finishes. You should increase this if you want a faster simulation, or decrease it if you want more "movement" in the simulation.
      .alphaDecay(0.0005) // [0, 1] The rate at which the simulation alpha approaches 0. you should decrease this if your bubbles are not completing their transitions between simulation states.
      .restart();
  }

  /* function tooltipOver() {
    hovered = node;
    active != active;
  }
 */

  let groupByContinent = false;
  let hovered, hoveredContinent;

  let active;
</script>

<!-- <ul class="navigation">
  <li>Lower Chamber</li>
  <li>Upper Chamber</li>
  <li>Structure</li>
</ul> -->
<div class="title">
  <h1>
    Women Representation Across Various Country's Lower Parliamentary House
  </h1>
  <p>
    Explore the the visualisation by clicking on the Chart to show Regional
    trend
  </p>
</div>

<Legend {colorScale} bind:hoveredContinent />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="chart-container"
  bind:clientWidth={width}
  on:click={() => {
    groupByContinent = !groupByContinent;
    hovered = null;
  }}
>
  <svg {width} {height}>
    <AxisY {yScale} {groupByContinent} />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <g
      class="inner-chart"
      transform="translate({margin.left}, {margin.top})"
      on:mouseleave={() => (hovered = null)}
    >
      <AxisX {xScale} height={innerHeight} width={innerWidth} {margin} />

      {#each nodes as node, i}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <circle
          in:fade={{ delay: 200 + 10 * i, duration: 400 }}
          cx={node.x}
          cy={node.y}
          r={radiusScale(node.Fem_Pop)}
          fill={node.Country === "Nigeria"
            ? "#00800D"
            : colorScale(node.Region)}
          on:mouseover={() => (hovered = node)}
          on:focus={() => (hovered = node)}
          tabindex="0"
          opacity={hovered || hoveredContinent
            ? hovered === node || hoveredContinent === node.Region
              ? 1
              : 0.3
            : 1}
          stroke={hovered || hoveredContinent
            ? hovered === node || hoveredContinent === node.Region
              ? "black"
              : "transparent"
            : "#00000090"}
          on:click={(event) => {
            event.stopImmediatePropagation();
          }}
        />
      {/each}
    </g>
  </svg>
  {#if hovered}
    <Tooltip data={hovered} {colorScale} {width} />
  {/if}
</div>

{#if hovered}
  <aside>
    <h3>More Information</h3>
    <h5>Women in Parliament</h5>
    <p>{hovered.Parliamentary_Participation}</p>
    <h5>Vulnearable Unemployment</h5>
    <p>{hovered.Vulnerable_Employment}</p>
    <h5>Vulnearable Unemployment</h5>
    <p>{hovered.Vulnerable_Employment}</p>
  </aside>
{/if}

<style>
  .chart-container {
    margin: 0.5rem 2rem;
  }
  .title {
    text-align: center;
  }
  .title h1 {
    text-align: center;
    font-size: 1.75rem;
    font-weight: 900;
    margin: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .title p {
    color: var(--hemp);
    border-bottom: 1px solid var(--shaft);
  }
  :global(.tick text, .axis-title) {
    font-size: 12px; /* How big our text is */
    font-weight: 400; /* How bold our text is */
    fill: hsla(212, 10%, 53%, 1); /* The color of our text */
    user-select: none; /* Prevents text from being selected */
  }

  circle {
    transition: stroke 300ms ease, opacity 300ms ease;
    cursor: pointer;
  }

  aside {
    position: absolute;
    top: 70px;
    right: 0px;
    transition: all 0.5s;
    width: 300px;
    max-width: 400px;
    padding: 0 20px;
    padding-bottom: 1.2rem;
    border-left: 5px solid var(--venus);
    background-color: var(--whitesmoke);
    overflow: hidden;
    z-index: 999;
  }

  aside h5 {
    font-weight: 600;
    padding-top: 1.2rem;
  }

  aside p {
    font-size: 0.8rem;
    line-height: 1.4;
    font-weight: 300;
    color: var(--raven);
  }

  @media (max-width: 540px) {
    .title h1 {
      font-size: 1.25rem;
      font-weight: 900;
      margin: 1rem;
      margin-bottom: 0.5rem;
    }
  }

  .title p {
    color: var(--hemp);
    border-bottom: 1px solid var(--shaft);
  }
</style>
