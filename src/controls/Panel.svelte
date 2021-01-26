<script>
  export let width: number = 960;
  export let height: number = 200;
  export let fill: string = "#ccc";
  export let type: string = "";
  export let x:number = 0;
  export let y:number = 0;
</script>

<style>
  g :global(text.panel) {
    text-anchor: end;
    dominant-baseline: ideographic;
    font-family: 'Audiowide', cursive;
    font-size: 200%;
    fill: url(#alpha0);
    opacity: 0.3;
  }
</style>

<g transform="translate({x},{y})">
  <rect {fill} {width} {height} rx="5" />
  <text class=panel y={height} x={width - 10}>{type}</text>
  <slot />
  <rect {width} height=5 fill="url(#alpha0)" />
  <rect transform="translate(0, {height-5})" {width} height=5 fill="url(#alpha180)" />
</g>