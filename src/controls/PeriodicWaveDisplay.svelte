<script>
  import { afterUpdate } from 'svelte';
  import {line, scaleLinear, extent, curveBasis, range, select} from 'd3';
  
  export let x = 0;
  export let y = 0;
  export let real: Float32Array = Float32Array.from([0,0,0]);
  export let imag: Float32Array = Float32Array.from([0,1,0]);

  let gEl:SVGGElement;

  const scaleX = scaleLinear()
  .domain([0, Math.PI * 2])
    .range([0,240]);
    

  const scaleY = scaleLinear()
    .domain(extent([...real, ...imag]))
    .range([0,20]);
    

  const lineDrawer = line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y))
    .curve(curveBasis);

  const f = (a:Array<number>,b:Array<number>) => (x:number) => 
    a.reduce((sum, coeff, n) => sum + coeff * Math.cos(n * x), 0) +
    b.reduce((sum, coeff, n) => sum + coeff * Math.sin(n * x), 0);

  let pathEl: SVGPathElement;
  
  afterUpdate(() => {
    console.log('drawerino', gEl);
    const data = range(0, Math.PI * 2, Math.PI * 2 / 20).concat(Math.PI * 2).map(x => ({x, y: f(real, imag)(x)}));
    console.log(data);
    select(pathEl).attr('d', lineDrawer(data));
  });

</script>

<style>
  path {
    stroke: red;
    fill: none;
  }
</style>

<g bind:this={gEl} transform="translate({x},{y})">
  <path bind:this={pathEl} />
</g>