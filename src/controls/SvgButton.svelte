<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let textEl: SVGTextElement;
  export let text: string = "n/a";
  export let x: number = 0;
  export let y: number = 0;
  export let padding: number = 5;
  let textBox: DOMRect = {
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

  afterUpdate(() => {
    textBox = textEl.getBBox();
  });
</script>

<g
  transform="translate({x}, {y + 7})"
  on:click|stopPropagation|preventDefault={(e) => dispatch(e.type, e)}
  on:touchstart|stopPropagation|preventDefault={(e) => dispatch(e.type, e)}
  on:touchend|stopPropagation|preventDefault={(e) => dispatch(e.type, e)}
  on:mousedown|stopPropagation|preventDefault={(e) => dispatch(e.type, e)}
  on:mouseup|stopPropagation|preventDefault={(e) => dispatch(e.type, e)}
>
  <rect
    fill="grey"
    rx="5"
    x={textBox.x - padding}
    y={textBox.y - padding}
    width={textBox.width + padding * 2}
    height={textBox.height + padding * 2}
    filter="url(#black-glow)"
  />
  <text bind:this={textEl}>{text}</text>
</g>

<style>
  text {
    dominant-baseline: hanging;
  }
  rect {
    cursor: pointer;
  }
</style>
