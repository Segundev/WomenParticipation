<script>
  import AxisX from "$lib/AxisX.svelte";
  import AxisY from "$lib/AxisY.svelte";
  import Legend from "$lib/Legend.svelte";
  import data from "$lib/data.json";
  import Country from "$lib/Country.svelte";

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
  import CircleLegend from "$lib/CircleLegend.svelte";
  // write a code that takes the original data and input either lower or upper
  $: chamber = "Lower_Percentage";
  $: filteredData = data.filter((d) => d[chamber] !== null);

  let width = 400;
  let height = 500;

  const margin = { top: 0, right: 10, bottom: 0, left: 90 };

  $: innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  const continents = rollups(
    data.filter((d) => d.chamber !== "Nan"),
    (v) => mean(v, (d) => d.chamber),
    (d) => d.Region
  )
    .sort((a, b) => a[1] - b[1])
    .map((d) => d[0]);

  const countries = data.map((d) => d.Country);

  const colorRange = [
    "#AEC2C1",
    "#EEE3AB",
    "#B8D39C",
    "#F4D6B8",
    "#9AD0D6",
    "#fdb462",
    "#ede492",
  ];

  let colorScale = scaleOrdinal()
    .domain(continents) // continents was already defined in our code
    .range(colorRange);

  $: xScale = scaleLinear()
    .domain([0, 62]) // Alternatively, we could pass .domain(extent(data, d => d.happiness))
    .range([0, innerWidth]);

  $: radiusScale = scaleSqrt()
    .domain(extent(filteredData, (d) => d.Fem_Pop))
    .range(width < 650 ? [4, 20] : [2, 24]);

  let yScale = scaleBand()
    .domain(continents)
    .range([innerHeight, 0])
    .paddingOuter(0.5);

  $: simulation = forceSimulation(filteredData);
  let nodes = [];
  $: simulation.on("tick", () => {
    nodes = simulation.nodes();
  });

  $: {
    simulation
      .force(
        "x",
        forceX()
          .x((d) => xScale(d[chamber]))
          .strength(0.8)
      )
      .force(
        "y",
        forceY()
          .y((d) => yScale(d.Region))
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

  let filteredCountries = [];

  const filterCountries = () => {
    let storageArr = [];
    if (inputValue) {
      countries.forEach((country) => {
        if (country.toLowerCase().startsWith(inputValue.toLowerCase())) {
          storageArr = [...storageArr, makeMatchBold(country)];
        }
      });
    }
    filteredCountries = storageArr;
  };

  let searchInput; // use with bind:this to focus element
  let inputValue = "";

  $: if (!inputValue) {
    filteredCountries = [];
    hiLiteIndex = null;
  }

  const clearInput = () => {
    inputValue = "";
    searchInput.focus();
  };

  const setInputVal = (countryName) => {
    inputValue = removeBold(countryName);
    filteredCountries = [];
    hiLiteIndex = null;
    document.querySelector("#country-input").focus();
  };

  const submitValue = () => {
    if (inputValue) {
      console.log(`${inputValue} is submitted!`);
      setTimeout(clearInput, 1000);
    } else {
      alert("You didn't type anything.");
    }
  };

  const makeMatchBold = (str) => {
    // replace part of (country name === inputValue) with strong tags
    let matched = str.substring(0, inputValue.length);
    let makeBold = `<strong>${matched}</strong>`;
    let boldedMatch = str.replace(matched, makeBold);
    return boldedMatch;
  };

  const removeBold = (str) => {
    //replace < and > all characters between
    return str.replace(/<(.)*?>/g, "");
    // return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
  };

  /* NAVIGATING OVER THE LIST OF COUNTRIES W HIGHLIGHTING */
  let hiLiteIndex = null;
  //$: console.log(hiLiteIndex);
  $: hiLitedCountry = filteredCountries[hiLiteIndex];

  const navigateList = (e) => {
    if (e.key === "ArrowDown" && hiLiteIndex <= filteredCountries.length - 1) {
      hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1);
    } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
      hiLiteIndex === 0
        ? (hiLiteIndex = filteredCountries.length - 1)
        : (hiLiteIndex -= 1);
    } else if (e.key === "Enter") {
      setInputVal(filteredCountries[hiLiteIndex]);
    } else {
      return;
    }
  };

  let groupByContinent = false;
  let hovered, hoveredContinent;
  let moredetails;
  let search;
</script>

<svelte:window on:keydown={navigateList} />
<div class="main-container">
  <div class="title">
    <h1>How many women sit at your country's house of legislature?</h1>

    <div class="navigation">
      <div class="search autocomplete">
        <input
          id="country-input"
          type="text"
          bind:value={inputValue}
          bind:this={searchInput}
          on:input={filterCountries}
          placeholder="Search for your Country"
        />
        {#if filteredCountries.length > 0}
          <ul id="autocomplete-items-list">
            {#each filteredCountries as country, i}
              <!-- svelte-ignore missing-declaration -->
              <Country
                itemLabel={country}
                highlighted={i === hiLiteIndex}
                on:click={() => setInputVal(country)}
              />
            {/each}
          </ul>
        {/if}
      </div>
      <ul>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class:selected={chamber === "Lower_Percentage"}
          on:click={() => {
            chamber = "Lower_Percentage";
          }}
        >
          Lower Chamber
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class:selected={chamber === "Upper_Percentage"}
          on:click={() => {
            chamber = "Upper_Percentage";
          }}
        >
          Upper Chamber
        </li>
      </ul>
      <div class="title-hover">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          ><title>gesture-double-tap</title><path
            d="M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5M11,3A6,6 0 0,1 17,9C17,10.7 16.29,12.23 15.16,13.33L14.16,12.88C15.28,11.96 16,10.56 16,9A5,5 0 0,0 11,4A5,5 0 0,0 6,9C6,11.05 7.23,12.81 9,13.58V14.66C6.67,13.83 5,11.61 5,9A6,6 0 0,1 11,3Z"
          /></svg
        >
        <p>Hover or Click to Interact</p>
      </div>
    </div>
  </div>
  <!-- <Legend {colorScale} bind:hoveredContinent /> -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->

  <div class="chart-wrapper">
    <div
      class="chart-container"
      bind:clientWidth={width}
      on:click={() => {
        groupByContinent = !groupByContinent;
        hovered = null;
      }}
    >
      <CircleLegend {radiusScale} {margin} height={innerHeight} {width} />
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
              fill={inputValue === node.Country
                ? "#ff0000"
                : colorScale(node.Region)}
              on:click={() => (moredetails = node)}
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
                event.stopPropagation();
              }}
            />
          {/each}
        </g>
      </svg>
      {#if hovered}
        <Tooltip data={hovered} {width} {chamber} />
      {/if}
    </div>
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="aside-section">
    {#if moredetails}
      <aside transition:fly={{ x: 200, delay: 400, duration: 800 }}>
        <div class="aside-flex">
          <h5 class="aside-countryheader">{moredetails.Country}</h5>
          <svg
            on:click={() => (moredetails = null)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><title>close</title><path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            /></svg
          >
        </div>

        <h5>Women in Parliament</h5>
        <p>{moredetails.Parliamentary_Participation}</p>
        <h5>Gender Based Violence</h5>
        <p>{moredetails.GBV}</p>
        <h5>Vulnerable Unemployment</h5>
        <p>{moredetails.Vulnerable_Employment}</p>
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
  }

  .title-hover svg {
    width: 30px;
    height: 30px;
    fill: var(--whitesmoke);
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .search {
    position: relative;
    overflow: visible;
    font-weight: 600;
    font-size: 0.8rem;
  }

  .search input {
    width: 100%;
    height: 44px;
    border-radius: 100px;
    border: 1px solid #aaa;
    margin: 0;
    box-sizing: border-box;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    padding-left: 53px;
    background: #f9f9f9 url(magnify.svg) 22px no-repeat;
    outline: none;
    background-size: 20px;
  }

  .search input:focus {
    box-shadow: inset 0 0 0 3px var(--cerise);
    border: 0;
  }

  input[type="text"] {
    background-color: #f1f1f1;
    width: 100%;
  }

  div.autocomplete {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
    width: 300px;
  }

  #autocomplete-items-list {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    top: 0;
    width: 297px;

    z-index: 99;
  }

  .navigation ul {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    height: 40px;
  }

  .navigation ul li:first-of-type {
    border-radius: 10px 0 0 10px;
    border-right: 0;
  }

  .navigation ul li:last-of-type {
    border-radius: 0px 10px 10px 0px;
  }

  .navigation ul li {
    font-size: 14px;
    cursor: pointer;
    border: solid 1px #ccc;
    padding: 10px 18px;
    color: #999;
    background: #f9f9f9;
    border-color: #aaa;
  }

  .navigation ul li.selected {
    color: #000;
    background: #e9e9e9;
    border-color: #aaa;
    box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.2);
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

  .aside-section {
    position: absolute;
    top: 70px;
    right: 0px;
    transition: all 0.5s;
    width: 300px;
    max-width: 400px;
  }

  aside {
    padding: 0 20px;
    padding-bottom: 1.2rem;
    border-left: 5px solid var(--venus);
    overflow: hidden;
    background-color: var(--whitesmoke);
  }
  .aside-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .aside-flex svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  aside h5 {
    font-size: 1rem;
    font-weight: 600;
    padding-top: 1.2rem;
  }

  aside h5:first-of-type {
    padding-top: 0.2rem;
  }

  .aside-countryheader {
    text-align: center;
    margin: 0;
    font-size: 16px;
    padding-top: 1.75rem;
    font-weight: 900;
    color: var(--cerise);
    margin-top: 2rem;
  }

  aside p {
    font-size: 0.9rem;
    line-height: 1.75;
    font-weight: 300;
    color: var(--raven);
  }

  ul {
    padding-left: 0;
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

    .navigation {
      flex-direction: column-reverse;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  }
</style>
