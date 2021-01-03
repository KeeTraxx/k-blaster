<script>
  export let x: number = 0;
  export let y: number = 0;
  export let width: number = 24;
  export let height: number = 24;
</script>

<g transform="translate({x}, {y})">
  <rect fill="grey" rx="5" {width} {height} filter="url(#black-glow)" />
</g>
