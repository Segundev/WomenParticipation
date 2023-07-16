<script>
  import { fly, fade } from "svelte/transition";
  export let width;
  export let data;
  export let colorScale;

  let tooltipWidth;
  const xNudge = -5;
  const yNudge = 50;

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
  <div>
    <h1>
      {data.Country}
    </h1>
  </div>
  <div class="line" />
  <div class="para" style="background: {colorScale(data.Region)}">
    <p>
      {Math.round(data.Lower_Percentage)}%
    </p>
  </div>
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
  }

  div h1 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 900;
    margin-bottom: 3px;
    color: aliceblue;
    text-align: center;
    padding: 0.5rem 1rem;
    background: var(--shaft);
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
    border-radius: 12px;
  }

  .para {
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
    border-radius: 50px;
    height: 2rem;
    width: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div p {
    color: var(--shaft);
  }

  .line {
    width: 2px;
    height: 30px;
    border: 1px dashed gray;
  }
</style>
