<script>
  import AxisX from "$lib/AxisX.svelte";
  import AxisY from "$lib/AxisY.svelte";
  import Legend from "$lib/Legend.svelte";
  import data from "$lib/data.json";
  import { mean, rollups, extent } from "d3-array";
  import { fly, fade } from "svelte/transition";
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

  const margin = { top: 0, right: 10, bottom: 0, left: 90 };

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
    "#80A1C1",
    "#EEE3AB",
    "#D9CFC1",
    "#A77E58",
    "#BA3F1D",
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
    .range(width < 650 ? [6, 20] : [6, 24]);

  let yScale = scaleBand()
    .domain(continents)
    .range([innerHeight, 0])
    .paddingOuter(0.5);

  let simulation = forceSimulation(filteredData);
  let nodes = [];
  simulation.on("tick", () => {
    nodes = simulation.nodes();
  });

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
        forceCollide().radius((d) => radiusScale(d.Fem_Pop) + 1)
      )

      .alpha(1) // [0, 1] The rate at which the simulation finishes. You should increase this if you want a faster simulation, or decrease it if you want more "movement" in the simulation.
      .alphaDecay(0.09) // [0, 1] The rate at which the simulation alpha approaches 0. you should decrease this if your bubbles are not completing their transitions between simulation states.
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
  <h1>How many Women sit at your Country House of Legislature?</h1>
  <div class="title-hover">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      ><title>gesture-double-tap</title><path
        d="M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5M11,3A6,6 0 0,1 17,9C17,10.7 16.29,12.23 15.16,13.33L14.16,12.88C15.28,11.96 16,10.56 16,9A5,5 0 0,0 11,4A5,5 0 0,0 6,9C6,11.05 7.23,12.81 9,13.58V14.66C6.67,13.83 5,11.61 5,9A6,6 0 0,1 11,3Z"
      /></svg
    >
    <p>Hover or Click to Interact</p>
  </div>
</div>

<Legend {colorScale} bind:hoveredContinent />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="chart-wrapper" style="width:{hovered ? width - 900 : width}">
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
  <div>
    {#if hovered}
      <aside class:active in:fly={{ x: 200, delay: 400, duration: 800 }}>
        <div class="aside-flex">
          <h5>More Information</h5>
          <svg
            on:click={() => (active = true)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><title>close</title><path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            /></svg
          >
        </div>
        <h5>Women in Parliament</h5>
        <p>{hovered.Parliamentary_Participation}</p>
        <h5>Gender Based Violence</h5>
        <p>{hovered.GBV}</p>
        <h5>Vulnerable Unemployment</h5>
        <p>{hovered.Vulnerable_Employment}</p>
      </aside>
    {/if}
  </div>
</div>

<style>
  .chart-container {
    margin: 0.5rem 2rem;
  }
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title h1 {
    text-align: center;
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--mako);
    margin: 1.5rem;
    padding-bottom: 1rem;
    margin-bottom: 0;
    border-bottom: 1px solid #ccc;
  }

  .title-hover p {
    color: var(--whitesmoke);
    font-weight: 600;
  }

  .title-hover {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 12px;
    width: 240px;
    height: 40px;
    background: var(--blumine);
    margin-top: 1rem;
  }

  .title-hover svg {
    width: 30px;
    height: 30px;
    fill: var(--whitesmoke);
  }

  :global(.tick text, .axis-title) {
    font-size: 14px; /* How big our text is */
    font-weight: 600; /* How bold our text is */
    fill: var(--mako); /* The color of our text */
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
  .aside-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .aside-flex svg {
    width: 30px;
    height: 30px;
  }
  aside h5 {
    font-size: 1rem;
    font-weight: 600;
    padding-top: 1.2rem;
  }

  aside p {
    font-size: 0.9rem;
    line-height: 1.75;
    font-weight: 300;
    color: var(--raven);
  }

  aside .active {
    opacity: 0;
  }

  @media (max-width: 650px) {
    .title h1 {
      font-size: 1.65rem;
      font-weight: 900;
      margin: 1rem;
      margin-bottom: 0.5rem;
    }

    .chart-container {
      margin-left: 0.5rem;
    }
  }
</style>
