<script>
  import GainAnalyzer from "./GainAnalyzer.svelte";

  import VerticalSlider from "./VerticalSlider.svelte";
  export let x: number = 0;
  export let y: number = 0;
  export let gainNode: GainNode;
  export let audioContext:AudioContext;
</script>

<style>
</style>

<g transform="translate({x},{y})">
  <GainAnalyzer {gainNode} {audioContext} />
  <VerticalSlider x={30} y={16} bind:value={gainNode.gain.value} />
</g>
