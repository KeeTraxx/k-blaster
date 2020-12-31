<script context="module">
  let count: number = 0;
</script>

<script>
  import { svgScale } from "../Util";

  import { afterUpdate, onMount } from "svelte";

  export let x: number = 0;
  export let y: number = 0;
  let width: number = 120;
  let height: number = 30;
  export let padding: number = 5;
  export let text: string = "";
  let textEl: SVGTextElement;
  let rootEl: SVGGElement;
  export const id = `dd-${count++}`;

  onMount(() => {
    const textRect = textEl.getBoundingClientRect();
    console.log(textEl.getBBox());
    const s = svgScale(rootEl);
    
  });
  afterUpdate(() => {
    const bbox = textEl.getBBox();
    width = bbox.width;
    height = bbox.height;
  })
</script>

<style>
</style>

<g bind:this={rootEl} transform="translate({x},{y})">
  <mask {id}>
    <rect {width} {height} fill="white" />
  </mask>
  <rect width={width + padding} height={height + padding} fill="darkgreen" />
  <text bind:this={textEl}>{text}</text>
</g>
