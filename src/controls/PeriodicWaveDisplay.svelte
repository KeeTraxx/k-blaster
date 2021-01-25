<script>
  import { afterUpdate } from 'svelte';
  import {line, scaleLinear, extent, range, select} from 'd3';
  
  export let x = 0;
  export let y = 0;
  export let customCosCoeffs: Float32Array = Float32Array.from([0,0,0]);
  export let customSinCoeffs: Float32Array = Float32Array.from([0,1,0]);
  export let oscillatorType: string;

  let gEl:SVGGElement;

  const scaleX = scaleLinear()
  .domain([0, Math.PI * 2])
    .range([0,240]);
    

  const scaleY = scaleLinear<any, any, any>()
    // @ts-ignore
    .domain(extent<any>([...customCosCoeffs, ...customSinCoeffs]))
    .range([0,15]);
    

  const lineDrawer = line<{x:number, y:number}>()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y));

  const f = (a:Float32Array,b:Float32Array) => (x:number) => 
    a.reduce((sum, coeff, n) => sum + coeff * Math.cos(n * x), 0) +
    b.reduce((sum, coeff, n) => sum + coeff * Math.sin(n * x), 0);

  let pathEl: SVGPathElement;
  
  afterUpdate(() => {
    scaleY.domain(extent<any>([...customCosCoeffs, ...customSinCoeffs]));
    const data = range(0, Math.PI * 2, Math.PI * 2 / 50)
    .concat(Math.PI * 2)
    .map(x => ({x, y: f(customCosCoeffs, customSinCoeffs)(x)}));
    // @ts-ignore
    select<SVGPathElement, {x:number, y:number}>(pathEl).attr('d', lineDrawer(data));
  });

</script>

<style>
  path {
    stroke: green;
    stroke-width: 2;
    fill: none;
  }

  rect {
    fill: #020;
  }
</style>

<g bind:this={gEl} transform="translate({x},{y})">
  <rect y=-40 width=240 height=70 />
  <path bind:this={pathEl} />
</g>