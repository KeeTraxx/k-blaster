<script>
  import { area, scaleLinear, select } from "d3";
  import log from "../helper/Logger";

  export let analyzerNode: AnalyserNode;
  const data: Uint8Array = new Uint8Array(analyzerNode.frequencyBinCount);
  const scaleX = scaleLinear()
    .domain([0, analyzerNode.frequencyBinCount])
    .range([0, 640]);
  const scaleY = scaleLinear().domain([0, 255]).range([200, 0]);

  const areaDrawer = area<number>()
    .x((_, i) => scaleX(i))
    .y1((d) => scaleY(d))
    .y0(scaleY(0));

  let pathEl: SVGPathElement;

  function draw() {
    analyzerNode.getByteFrequencyData(data);
    const s = areaDrawer(data) || '';
    select<any, any>(pathEl).attr('d', s);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
</script>

<path bind:this={pathEl} />

<style>
  path {
    fill: black;
    stroke: red;
  }
</style>