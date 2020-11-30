<script lang="typescript">
  import "./TailwindCSS.svelte";
  import Rack from "./Rack.svelte";
  import configuration from "./defaultRack.json";

  let audioContext:AudioContext;
</script>

<style>
</style>

{#if audioContext}
  <Rack {audioContext} {configuration} />
{:else}
<div on:click={e => audioContext = new AudioContext()}>no audiocontext</div>
{/if}
