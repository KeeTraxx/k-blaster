<script>
  import { scaleLinear } from "d3";
  import type AbstractAudioDevice from "../lib/AbstractAudioDevice";
  import type { AudioPort } from "../types";
  import { onDestroy } from "svelte";
  export let x = 0;
  export let y = 0;
  export let width = 20;
  export let height = 136;
  export let port: AudioPort<AbstractAudioDevice>;

  let loudness = 255;

  const analyserNode: AnalyserNode = port.device.getAnalyzer(port);
  const fftData = new Uint8Array(analyserNode.frequencyBinCount);
  requestAnimationFrame(draw);
  const scaleY = scaleLinear()
    .domain([0, 255])
    .range([height - 10, 10]);

  const scaleHeight = scaleLinear()
    .domain([0, 255])
    .range([0, height - 20]);
  function draw() {
    analyserNode.getByteFrequencyData(fftData);
    loudness = fftData.reduce((max, c) => Math.max(c, max), 0);
    requestAnimationFrame(draw);
  }
</script>

<defs>
  <linearGradient id="GainAnalyzerGradient" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="#888" />
    <stop offset="40%" stop-color="#000" />
    <stop offset="100%" stop-color="#000" />
  </linearGradient>
  <linearGradient id="LoudnessGradient" gradientTransform="rotate(90)">
    <stop offset="19%" stop-color="#f00" />
    <stop offset="20%" stop-color="#ff0" />
    <stop offset="40%" stop-color="#ff0" />
    <stop offset="41%" stop-color="#0f0" />
  </linearGradient>
  <mask id="LoudnessMask">
    {#each Array(25) as _, i}
      <rect y={i * 8} height="6" width="20" fill="white" />
    {/each}
  </mask>
</defs>
<g transform="translate({x},{y})">
  <rect
    {width}
    {height}
    rx="3"
    fill="url(#GainAnalyzerGradient)"
    stroke="black"
    stroke-width="1"
  />
  <!-- rect x="3" y="8" width="14" height="120" fill="#0f0" /-->
  <rect
    x="5"
    y={scaleY(loudness)}
    width="10"
    height={scaleHeight(loudness)}
    fill="url(#LoudnessGradient)"
    mask="url(#LoudnessMask)"
  />
</g>

<style>
  line {
    stroke: url("#LoudnessGradient");
    stroke-width: 1em;
    stroke-dasharray: 5 3;
  }
</style>
