<script context="module">
  import Matter from "matter-js";
  const { Composites, Composite, Engine, Render, World, Bodies } = Matter;
  const engine = Engine.create();
  console.log(engine);
</script>

<script>
  let x1: number = 200;
  let y1: number = 50;
  let x2: number = 400;
  let y2: number = 100;
</script>

<style>
  path {
    stroke: red;
    stroke-width: 5px;
    filter: url(#cable);
    stroke-linecap: round;
    pointer-events: none;
    fill: none;
  }
</style>

<!-- C x1 y1, x2 y2, x y  -->
<path
  d="M{x1} {y1} C{x1} {y1 + 50}, {(x1 + x2) / 2} {y1 + 50}, {(x1 + x2) / 2} {y1 + 50} S{x2} {y2 + 50}, {x2} {y2}" />
