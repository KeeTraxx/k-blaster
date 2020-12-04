<script context="module">
    const rackPortElements: Array<AudioPort> = [];
</script>

<script>
    import { onDestroy } from "svelte";

    import { end, start } from "../rack-components/Rack.svelte";
    import type { AudioPort } from "../types";
    export let audioPort: AudioPort<AudioNode>;
    export let x: number = 0;
    export let y: number = 0;
    export let label: string = "";

    function touchEnd(ev: TouchEvent) {
        if (ev.changedTouches.length === 1) {
            const endElement = document.elementFromPoint(
                ev.changedTouches[0].clientX,
                ev.changedTouches[0].clientY
            );
            console.log(endElement);
            const port = rackPortElements.find((d) => d.element === endElement);
            end(port);
        }
    }
    rackPortElements.push(audioPort);

    onDestroy(() => {
        const index = rackPortElements.indexOf(audioPort);
        if (index > -1) {
            rackPortElements.splice(index, 1);
        }
    });
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

<text {x} y={y - 8}>{label}</text>
<circle
    r="5"
    cx={x}
    cy={y}
    bind:this={audioPort.element}
    on:mousedown|stopPropagation={(e) => start(audioPort)}
    on:mouseup|stopPropagation={(e) => end(audioPort)}
    on:touchstart|stopPropagation={(e) => start(audioPort)}
    on:touchend|stopPropagation={(e) => touchEnd(e)} />
