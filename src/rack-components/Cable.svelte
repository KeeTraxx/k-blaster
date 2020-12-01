<script>
  import {
    line,
    select,
    curveBasis,
    range,
    forceSimulation,
    pairs,
    forceCollide,
    forceLink,
    forceY,
  } from "d3";
  import { onMount } from "svelte";
  export let x1: number = 100;
  export let y1: number = 200;
  export let x2: number = 400;
  export let y2: number = 200;

  const cableParts = 5;

  const pathDrawer2 = line<any>()
    .x((d) => d.x || 0)
    .y((d) => d.y || 0)
    .curve(curveBasis);

  let distance = () => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  const cableNodes: Array<any> = range(cableParts).map(() => ({}));

  cableNodes[0].fx = x1;
  cableNodes[0].fy = y1;

  cableNodes[cableNodes.length - 1].fx = x2;
  cableNodes[cableNodes.length - 1].fy = y2;

  const sim = forceSimulation(cableNodes)
    .force("gravity", forceY(2000).strength(0.005))
    .force(
      "link",
      forceLink()
        .links(
          pairs(cableNodes).map(([source, target]) => ({ source, target }))
        )
        .distance(distance() / cableParts)
        .strength(0.9)
    )
    .force("collide", forceCollide(20));
  let pathElement: SVGPathElement;

  onMount(() => {
    const pathSelection = select<SVGPathElement, Body>(pathElement);
    sim.on("tick", () => {
      pathSelection.attr("d", () => pathDrawer2(cableNodes));
    });
  });

  $: {
    cableNodes[0].fx = x1;
    cableNodes[0].fy = y1;

    cableNodes[cableNodes.length - 1].fx = x2;
    cableNodes[cableNodes.length - 1].fy = y2;
    sim.force<any>("link").distance(distance() / cableParts)

    sim.alpha(1);
    sim.restart();
  }
</script>

<style>
  path {
    stroke: red;
    stroke-width: 5px;
    stroke-linecap: round;
    pointer-events: none;
    fill: none;
  }
</style>

<path bind:this={pathElement} />
