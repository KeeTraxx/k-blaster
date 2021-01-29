<script>
    import log from "../helper/Logger";
    import { onDestroy, onMount } from "svelte";
    import { portMap, startPort } from "../store/CableStore";
    import type { GenericPort } from "../types";
    import { connect, disconnect } from "../lib/PortUtil";

    export let x: number = 0;
    export let y: number = 0;
    export let label: string = "";

    export let port: GenericPort;

    function start(ev: Event) {
        const remotePort = disconnect(port);
        $startPort = remotePort || port;

        const mouseUpListener = (ev: MouseEvent) => {
            const targetPort = $portMap.get(ev.target);
            ev.preventDefault();
            if ($startPort !== undefined && targetPort !== undefined) {
                // @ts-ignore
                connect($startPort, targetPort);
            }
            
            $startPort = undefined;
            window.removeEventListener("mouseup", mouseUpListener);
        };

        const touchEndListener = (ev: TouchEvent) => {
            if (ev.changedTouches.length === 1) {
                const touch = ev.changedTouches[0];
                const el = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                );
                const targetPort = $portMap.get(el);
                if ($startPort !== undefined && targetPort !== undefined) {
                    // @ts-ignore
                    connect($startPort, targetPort);
                }
                ev.preventDefault();
            }
            startPort.set(undefined);
            window.removeEventListener("touchend", touchEndListener);
        };

        window.addEventListener("mouseup", mouseUpListener);
        window.addEventListener("touchend", touchEndListener);
    }

    onMount(() => {
        $portMap.set(port.element, port);
        portMap.update(m => m);
    });
    
    onDestroy(() => {
        $portMap.delete(port.element);
        port.element = undefined;
    });
</script>

<g
    transform="translate({x},{y})"
    on:mousedown|stopPropagation={(e) => start(e)}
    on:touchstart|stopPropagation={(e) => start(e)}
>
    <text y="-8">{label}</text>
    <circle r="5" bind:this={port.element} />
</g>

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
