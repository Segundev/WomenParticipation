<script>
  import Header from "$lib/Header.svelte";
  import IntroPage from "./IntroPage.svelte";
  import Charts from "./Charts.svelte";
  import "../style.css";
  let state = "welcome";

  function handleMessage(event) {
    state = event.detail;
  }
</script>

<main>
  <Header />
  {#if state === "welcome"}
    <IntroPage on:clickExplore={handleMessage} />
  {:else if state === "charts"}
    <Charts />
  {/if}
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    backdrop-filter: blur(675px);
    overflow-x: hidden;
  }
</style>
