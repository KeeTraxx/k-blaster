<script>
  import GainAnalyzer from "./GainAnalyzer.svelte";

  import VerticalSlider from "./VerticalSlider.svelte";
  export let x: number = 0;
  export let y: number = 0;
  export let height: number = 100;
  export let label: string = "";
  export let gainNode: GainNode;
  export let audioContext: AudioContext;
</script>

<g transform="translate({x},{y})">
  <text x="16" y={12}>{label}</text>
  <GainAnalyzer y={16} height={height - 16} {gainNode} {audioContext} />
  <VerticalSlider
    x={20}
    y={14}
    height={height - 16}
    bind:value={gainNode.gain.value}
  />
</g>

<g>
  text {
    text-anchor: middle;
    font-family: Teko;
  }
</g>
