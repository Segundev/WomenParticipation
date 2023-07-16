<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function helpPage() {
    dispatch("clickExplore", "charts");
  }
</script>

<div class="intro-wrapper">
  <div class="welcome-intro">
    <h1>Women's Representation in Leadership</h1>
    <div class="intro-text-wrapper">
      <p>
        The dashboard provides a comprehensive and interactive overview of
        women's participation in parliaments across various countries. The data
        collected are from reputable sources and you can explore the current
        state of women's representation in different political systems. Explore
        the dashboard, engage with the data, in order to continue the advocay
        for increased women's representation in parliaments worldwide.
      </p>
      <button on:click={helpPage}> Explore </button>
    </div>
  </div>
</div>

<style>
  .intro-wrapper {
    background-color: var(--peach);
    height: 100%;
  }

  .welcome-intro {
    width: 650px;
    margin: 0 auto;
  }

  .welcome-intro h1 {
    text-align: center;
    font-weight: 800;
    letter-spacing: 0.9;
    line-height: 1.2;
    padding-top: 4rem;
    color: var(--mako);
  }

  .intro-text-wrapper {
    background-color: var(--whitesmoke);
    margin-top: 2rem;
    padding: 1rem;
    padding-bottom: 2rem;
    text-align: center;
  }

  .intro-text-wrapper p {
    font-weight: 300;
    line-height: 2;
    margin-bottom: 1rem;
  }

  .intro-text-wrapper button {
    background-color: var(--blumine);
    font-size: large;
    font-weight: bold;
    color: var(--whitesmoke);
    padding: 1rem 2rem;
    border-radius: 24px;
    border: 0px;
    cursor: pointer;
  }

  .intro-text-wrapper button:hover {
    background-color: var(--cerise);
  }

  @media (max-width: 370px) {
    .welcome-intro {
      max-width: 370px;
      margin: 0 auto;
    }

    .intro-text-wrapper button {
      padding: 0.75rem 1rem;
      border-radius: 12px;
    }

    .intro-wrapper h1 {
      font-size: 1rem;
    }
  }
</style>
