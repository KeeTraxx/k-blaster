<script context="module">
    import type { Port } from "../types";
    const ports: Array<Port> = [];
</script>

<script>
    import { onDestroy, onMount } from "svelte";

    export let x: number = 0;
    export let y: number = 0;
    export let label: string = "";
    export let isOutput: boolean = false;
    export let target: any;
    export let type: string = "unknown";

    let element: SVGElement;

    function touchEnd(ev: TouchEvent) {
        if (ev.changedTouches.length === 1) {
            const endElement = document.elementFromPoint(
                ev.changedTouches[0].clientX,
                ev.changedTouches[0].clientY
            );
            console.log(endElement);
            /* const port = rackPortElements.find((d) => d.element === endElement);
            end(port);
            */
        }
    }

    onMount(() =>
        ports.push({
            element,
            isOutput,
            target,
            type,
        })
    );

    onDestroy(() => ports.splice(ports.findIndex(d => d.target === target)));

    function start() {
        console.log("start", window);
        const listener = (ev:Event) => {
            console.log('ender', ev);
            window.removeEventListener("mouseup", listener);
        }

        window.addEventListener("mouseup", listener);
    }

    function end() {
        console.log("end");
    }
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
    bind:this={element}
    on:mousedown|stopPropagation={(e) => start()}
    on:mouseup|stopPropagation={(e) => end()}
    on:touchstart|stopPropagation={(e) => start()}
    on:touchend|stopPropagation={(e) => touchEnd(e)} />
