<script>
  import { area, scaleLinear, select, axisBottom } from "d3";
  import { onMount } from "svelte";
  import log from "../helper/Logger";

  const SPECTRUM_WIDTH: number = 640;
  const SPECTRUM_HEIGHT: number = 150;

  export let analyzerNode: AnalyserNode;
  export let sampleRate: number;
  const data: Uint8Array = new Uint8Array(analyzerNode.frequencyBinCount);
  const scaleX = scaleLinear()
    .domain([0, sampleRate / 2])
    .range([0, SPECTRUM_WIDTH])
    .nice();

  const scaleY = scaleLinear().domain([0, 255]).range([SPECTRUM_HEIGHT, 0]);

  const areaDrawer = area<number>()
    .x((_, i) =>
      scaleX(((i / analyzerNode.frequencyBinCount) * sampleRate) / 2)
    )
    .y1((d) => scaleY(d))
    .y0(scaleY(0));

  let pathEl: SVGPathElement;
  let xAxisEl: SVGGElement;
  onMount(() => {
    select(xAxisEl).call(axisBottom(scaleX).tickFormat(d => (d.valueOf() / 1000).toFixed(0) + 'kHz'));
  });

  function draw() {
    analyzerNode.getByteFrequencyData(data);
    const s = areaDrawer(data) || "";
    select<any, any>(pathEl).attr("d", s);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
</script>

<g transform="translate(20, 10)">
  <rect width={SPECTRUM_WIDTH+20} height={SPECTRUM_HEIGHT} />
  <path bind:this={pathEl} />
  <g class="xAxis" transform="translate(0,{SPECTRUM_HEIGHT})" bind:this={xAxisEl} />
</g>

<style>
  path {
    fill: #050;
    stroke: #0b0;
  }

  rect {
    fill: #030;
  }

  g.xAxis :global(text) {
    text-anchor: end;
    transform: translate(-1em, 0em) rotate(-45deg);
    font-family: VT323;
  }
</style>
