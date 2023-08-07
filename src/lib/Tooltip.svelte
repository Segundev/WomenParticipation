<script>
  import { fly, fade } from "svelte/transition";
  export let width;
  export let data;
  export let chamber;

  let tooltipWidth;
  const xNudge = 15;
  const yNudge = 10;

  $: xPosition =
    data.x + tooltipWidth + xNudge > width
      ? data.x - tooltipWidth - xNudge
      : data.x - xNudge;
  $: yPosition = data.y - yNudge;
</script>

<div
  class="tooltip"
  in:fly={{ y: 10, duration: 200, delay: 200 }}
  out:fade
  style="left:{xPosition}px; top:{yPosition}px;"
  bind:clientWidth={tooltipWidth}
>
  <h5>{data.Country}</h5>
  <div class="barchart">
    <span>Female</span>
    <div
      class="female"
      style="width:{chamber === `Lower_Percentage`
        ? data.Lower_Percentage
        : data.Upper_Percentage}px"
    >
      <span class="female-figures">
        {chamber === `Lower_Percentage`
          ? data.Lower_Percentage
          : data.Upper_Percentage}%</span
      >
    </div>
    <div
      class="male"
      style="width:{chamber === `Lower_Percentage`
        ? 100 - data.Lower_Percentage
        : 100 - data.Upper_Percentage}px"
    >
      <span class="male-figures">
        {chamber === `Lower_Percentage`
          ? 100 - data.Lower_Percentage
          : 100 - data.Upper_Percentage}%</span
      >
    </div>
    <span>Male</span>
  </div>

  <div class="seat">
    <p>
      Total Seats: <span>
        {chamber === `Lower_Percentage` ? data.Lower_STN : data.Upper_STN}</span
      >
    </p>
    <p>
      Number of Women: <span class="figures">
        {chamber === `Lower_Percentage` ? data.Lower_WC : data.Upper_WC}</span
      >
    </p>
  </div>
  <p>Compulsory Voting: <span> {data.Compulsory_Voting}</span></p>
  <p>Structure: <span> {data.Structure}</span></p>
  <!-- <div>
    <h1>
      {data.Country}
    </h1>
  </div>
  <div class="line" />
  <div class="para" style="background: {colorScale(data.Region)}">
    <p>
      {Math.round(data.Lower_Percentage)}%
    </p>
  </div> -->
</div>

<style>
  .tooltip {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    pointer-events: none;
    transition: top 300ms ease, left 300ms ease;
    background: #ffffff;
    border: 0.5px solid #dedede;
    border-radius: 4px;
    padding: 6px 8px;
  }

  .tooltip h5 {
    font-size: 0.9rem;
    font-weight: 900;
    color: #252525;
    padding: 4px 6px 2px 6px;
    border-bottom: 0.75px solid #dfdfdf;
  }

  .tooltip p {
    color: #afafaf;
    font-size: 14px;
  }

  .tooltip .seat {
    display: flex;
    column-gap: 1rem;
    font-style: italic;
  }

  span {
    font-weight: 600;
    color: #525252;
  }

  .tooltip .female-figures {
    color: #fff;
    float: left;
  }

  .tooltip .male-figures {
    color: #fff;
    float: right;
  }

  div p {
    color: var(--shaft);
  }

  .barchart {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 25px;
    color: #ffffff;
    font-size: 10px;
    margin-top: 5px;
  }

  .barchart span {
    color: #999999;
    margin: 2px;
  }

  .female {
    background-color: #cc3366;
    height: 100%;
    position: relative;
  }

  .male {
    background-color: #132841;
    height: 100%;
    position: relative;
  }
</style>
