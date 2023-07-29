<script>
  import { createEventDispatcher } from "svelte";
  let active = false;

  const dispatch = createEventDispatcher();
</script>

<header>
  <div class="logo" on:click={() => dispatch("backHomePage", "welcome")}>
    DataVizAfrica
  </div>
  <div class="help-wrapper">
    <svg
      on:click={() => (active = !active)}
      class="help-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      ><path
        d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
      /></svg
    >
  </div>
  <aside class:active>
    <h5>About</h5>
    <p>
      The Project Idea came up as a result of DataFest 2023 VizQuest data
      visualisation competition. The competition offers an inclusive platform
      for participants to showcase their skills and contribute to meaningful
      change.
    </p>
    <h5>Data</h5>
    <p>
      Data Sources from Inter-Parliamentary Union Database and World Bank. The
      Visualisations utilized Gender specific data from Percentage of Women in a
      Nations Lower Chamber (Parliament). Total Female population across various
      Countries and their continent
    </p>
    <h5>Developed By</h5>
    <p>Jayeola Gbenga</p>
    <h5>Team</h5>
    <p>Data Collection by Benedicta Elikor and Jayeola Gbenga</p>
    <h5>Mentored By</h5>
    <p>Can Kayali</p>
    <h5>Inspiration</h5>
    <p>Connor RothsChild</p>
  </aside>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.5rem;
    background-color: var(--cerise);
    border-bottom: 5px solid var(--sun);
  }

  aside {
    position: absolute;
    top: 70px;
    right: -500px;
    transition: all 1s;
    width: 300px;
    max-width: 400px;
    padding: 0 20px;
    padding-bottom: 1.2rem;
    border-left: 5px solid var(--hemp);
    background-color: var(--whitesmoke);
    overflow: hidden;
    z-index: 99;
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

  .active {
    right: 0px;
  }

  header .logo {
    font-size: var(--h5);
    font-weight: bolder;
    color: var(--whitesmoke);
  }

  .help-icon {
    width: 35px;
    height: 35px;
    fill: var(--whitesmoke);
  }
</style>
