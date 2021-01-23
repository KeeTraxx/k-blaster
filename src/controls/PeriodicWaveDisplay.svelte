<script>
  import {line, scaleLinear, extent} from 'd3';

  export let real: Array<number> = [0,1];
  export let imag: Array<number> = [0,0];

  const scaleX = scaleLinear()
  .domain([0, Math.PI * 2])
    .range([0,240]);
    

  const scaleY = scaleLinear()
    .domain(extent([...real, ...imag]))
    .range([0,100]);
    

  const lineDrawer = line()
    .x((d, i) => scaleX(i))
    .y((d) => scaleY(d));
  

</script>