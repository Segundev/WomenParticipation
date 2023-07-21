<script>
  import { fly, fade } from "svelte/transition";
  export let width;
  export let data;
  export let colorScale;

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
  <p>
    Percentage of Women: <span class="figures"> {data.Lower_Percentage}%</span>
  </p>
  <div class="seat">
    <p>Total Seats: <span> {data.Lower_STN}</span></p>
    <p>Number of Women: <span class="figures"> {data.Lower_WC}</span></p>
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

  .tooltip .figures {
    color: #cc3366;
  }

  div p {
    color: var(--shaft);
  }
</style>
