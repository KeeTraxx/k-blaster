<script>
import { scaleLinear } from "d3";
import { onDestroy } from "svelte";
  export let x = 0;
  export let y = 0;
  export let width = 20;
  export let height = 136;
  export let gainNode: GainNode;
  export let audioContext: AudioContext;

  let loudness = 255;

  const FFT_SIZE = 32;

  const analyserNode: AnalyserNode = audioContext.createAnalyser();
  analyserNode.maxDecibels = 0;
  analyserNode.minDecibels = -60;
  analyserNode.fftSize = FFT_SIZE;
  gainNode.connect(analyserNode);
  const fftData = new Uint8Array(analyserNode.frequencyBinCount);
  const floatData = new Float32Array(analyserNode.frequencyBinCount);
  let frame = requestAnimationFrame(draw);
  console.log('createAna', analyserNode.smoothingTimeConstant);
  const scale = scaleLinear().domain([0,255]).range([height-10, 10]);
  console.log('create');
  function draw() {
    analyserNode.getByteFrequencyData(fftData);
    loudness = fftData.reduce((max, c) => Math.max(c,max), 0);
    frame = requestAnimationFrame(draw);
  }

  onDestroy(() => {
    gainNode.disconnect(analyserNode);
  })
</script>

<style>
</style>

<defs>
  <linearGradient id="GainAnalyzerGradient" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="#888" />
    <stop offset="40%" stop-color="#000" />
    <stop offset="100%" stop-color="#000" />
  </linearGradient>
</defs>
<g transform="translate({x},{y})">
  <rect
    {width}
    {height}
    rx="3"
    fill="url('#GainAnalyzerGradient')"
    stroke="black"
    stroke-width="1" />
  <!-- rect x="3" y="8" width="14" height="120" fill="#0f0" /-->
  <line x1="10" y1={height-10} x2="10" y2={scale(loudness)} stroke="green" stroke-width="1em"/>
</g>
