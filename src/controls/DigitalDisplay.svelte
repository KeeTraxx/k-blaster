<script context="module">
  let count: number = 0;
</script>

<script>
  import { select, easeLinear } from "d3";
  import { afterUpdate } from "svelte";

  export let x: number = 0;
  export let y: number = 0;
  export let width: number = 120;
  export let fontSize: string = "";
  let ledBox: DOMRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    toJSON: () => "",
  };
  export let padding: number = 5;
  export let text: string = "";
  let textEl: SVGTextElement;
  let rootEl: SVGGElement;
  const id = `dd-${count++}`;
  function scroll() {
    if (!textEl) {
      return;
    }
    ledBox = textEl.getBBox();
    if (ledBox.width > width) {
      select(textEl)
        .attr("x", 0)
        .transition("scroll")
        .ease(easeLinear)
        .delay(1500)
        .duration(text.length * 150)
        .attr("x", `-${ledBox.width - width}`)
        .transition()
        .duration(1500)
        .on("end", scroll);
    } else {
      select(textEl).attr("x", (width - ledBox.width) / 2);
    }
    ledBox.width = width;
  }

  afterUpdate(() => {
    select(textEl).attr("x", null);
    scroll();
  });
</script>

<g bind:this={rootEl} transform="translate({x},{y})">
  <g transform="translate({padding},{padding + 2})">
    <mask {id}>
      <rect
        x={ledBox.x - padding}
        y={ledBox.y - padding}
        width={ledBox.width + padding * 2}
        height={ledBox.height + padding * 2}
        fill="white"
      />
    </mask>
    <rect
      x={ledBox.x - padding}
      y={ledBox.y - padding}
      width={ledBox.width + padding * 2}
      height={ledBox.height + padding * 2}
      rx="4"
      filter="url(#black-glow)"
    />
    <text bind:this={textEl} font-size={fontSize} mask="url(#{id})">
      {text}
    </text>
  </g>
</g>

<style>
  text {
    dominant-baseline: hanging;
    fill: #0d0;
    font-family: "VT323", monospace;
  }

  g > rect {
    fill: #040;
  }
</style>
