<script>
    import { end, start } from "../rack-components/Rack.svelte";
    import type { AudioPort } from "../types";
    export let audioPort: AudioPort<AudioNode>;
    export let x: number = 0,
        y: number = 0;
    export let label: string = "";
</script>

<style>
    circle {
        stroke: silver;
        fill: #333;
        stroke-width: 2px;
    }
    text {
        text-anchor: middle;
        font-size: 80%;
    }
</style>

<text x={x} y={y-8}>{label}</text>
<circle
    r="5"
    cx={x}
    cy={y}
    bind:this={audioPort.element}
    on:mousedown={(e) => start(e, audioPort)}
    on:mouseup={(e) => end(e, audioPort)} />
