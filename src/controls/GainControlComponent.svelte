<script>
import type AbstractAudioDevice from "src/lib/AbstractAudioDevice";

  import type { AudioPort } from "src/types";
  import GainAnalyzerComponent from "./GainAnalyzerComponent.svelte";

  import VerticalSlider from "./VerticalSlider.svelte";
  export let x: number = 0;
  export let y: number = 0;
  export let height: number = 100;
  export let label: string = "";
  export let port: AudioPort<AbstractAudioDevice, GainNode>;
</script>

<style>
  text {
    text-anchor: middle;
    font-family: Teko;
  }
</style>

<g transform="translate({x},{y})">
  <text x="16" y={12}>{label}</text>
  <GainAnalyzerComponent y={16} height={height - 16} {port} />
  <VerticalSlider
    x={20}
    y={14}
    height={height - 16}
    bind:value={port.node.gain.value}
  />
</g>
