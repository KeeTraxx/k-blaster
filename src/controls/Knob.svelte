<script>
  import { beforeUpdate } from "svelte";

  import DigitalDisplay from "./DigitalDisplay.svelte";
  export let x: number = 0;
  export let y: number = 0;
  let rot: number = 0;
  export let min: number = Number.MIN_VALUE;
  export let max: number = Number.MAX_VALUE;
  export let value: number = 0;
  export let step: number = 1;

  function mousewheel(e: WheelEvent) {
    value -= (step * e.deltaY) / Math.abs(e.deltaY);
  }

  beforeUpdate(() => {
    rot = (((value / step) * 360) / 10) % 360;
  });
</script>

<g
  transform="translate({x},{y})"
  on:mousewheel|stopPropagation|preventDefault={(e) => mousewheel(e)}
>
  <g transform="rotate({rot})">
    <circle r="10" />
    <circle r="2" class="dot" cy="-5" />
  </g>
  <g>
    <DigitalDisplay
      fontSize="8"
      text={value.toFixed(2)}
      width={20}
      y={15}
      x={-14}
    />
  </g>
</g>

<g>
  circle {
    fill: #ccc;
  }

  circle.dot {
    fill: #aaa;
  }
</g>
