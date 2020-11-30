<script context="module">
    import type { AudioPort } from "../types";
    let other: AudioPort<AudioNode> | null;
    export function start(ev: Event, port: AudioPort<AudioNode>) {
        console.log("start");
        ev.stopPropagation();
        ev.preventDefault();
        // check connections
        if (port.connection) {
            console.log("disconnect!!");
            other = port.connection;
            if (other === null) {
                return;
            }
            if (other.isOutput) {
                other.disconnect(port);
            } else {
                port.disconnect(other);
            }
            port.connection = undefined;
            other.connection = undefined;
        } else {
            // no connections
            other = port;
            console.log("real start!");
            // console.log("start", ev, port);
        }
    }
    export function end(ev: Event, toPort: AudioPort<AudioNode>) {
        console.log("end");
        ev.stopPropagation();
        ev.preventDefault();
        // console.log("end", ev, port);
        if (
            other != null &&
            toPort != null &&
            other.isOutput !== toPort.isOutput
        ) {
            const output = other.isOutput ? other : toPort;
            const input = !other.isOutput ? other : toPort;
            output.connect(input);
            output.connection = input;
            input.connection = output;
            console.log("connecting!", output, input);
        }
        other = null;
    }
</script>

<script>
    interface Device extends Svelte2TsxComponent {
        inputs: Array<AudioNode>;
        output: AudioNode;
        front: boolean;
    }
    import { onMount, SvelteComponentDev } from "svelte/internal";
    import Mixer from "./Mixer.svelte";
    import MasterOutput from "./MasterOutput.svelte";
    import { svgPos } from "../Util";
    import Oscillator from "./Oscillator.svelte";
    import Shaders from "./Shaders.svelte";
import Cable from "./Cable.svelte";
    export let audioContext: AudioContext;
    export let configuration: {
        devices: Array<{ type: string }>;
        connections: Array<any>;
    };
    export let front: boolean = true;
    let svg: SVGSVGElement;
    let floatingCable:
        | [{ x: number; y: number }, { x: number; y: number }]
        | undefined;
    const deviceMap: Record<
        string,
        { component: typeof SvelteComponentDev; heightUnits: number }
    > = {
        MasterOutput: { component: MasterOutput, heightUnits: 0.5 },
        Mixer: { component: Mixer, heightUnits: 2 },
        Oscillator: { component: Oscillator, heightUnits: 1 },
    };
    const devices: Array<Device> = [];
    const layout = configuration.devices.reduce<Array<number>>(
        (layout, device) => {
            return layout.concat(
                layout[layout.length - 1] +
                    deviceMap[device.type].heightUnits * 100
            );
        },
        [0]
    );
    console.log(layout);
    onMount(() => {
        console.log(devices[1].output);
    });
    function keydown(ev: KeyboardEvent) {
        if (ev.key === "Tab") {
            front = !front;
            ev.preventDefault();
        }
    }
    function reset() {
        console.log("reset");
        other = null;
        floatingCable = undefined;
    }
    function mouseMove(ev: MouseEvent) {
        if (other?.element !== undefined && svg !== null) {
            const rect: DOMRect = other.element.getBoundingClientRect();
            floatingCable = [
                svgPos(
                    { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
                    svg
                ),
                svgPos({ x: ev.clientX, y: ev.clientY }, svg),
            ];
        } else {
            floatingCable = undefined;
        }
    }
</script>

<style>
    .cables line {
        stroke: red;
        stroke-width: 5px;
        filter: url(#cable);
        stroke-linecap: round;
        pointer-events: none;
    }
</style>

<svelte:body
    on:keydown={keydown}
    on:mouseup={(e) => reset()}
    on:mousemove={mouseMove} />
<svg
    bind:this={svg}
    class="w-full h-full"
    viewBox="0 0 960 500"
    preserveAspectRatio="xMidYMin meet">
    <Shaders />
    {#each configuration.devices as device, i}
        <g transform="translate(0, {layout[i]})">
            <svelte:component
                this={deviceMap[device.type].component}
                {audioContext}
                {front}
                bind:this={devices[i]} />
        </g>
    {/each}
    <g class="cables">
        <line x2="200" y2="200" />
        {#if floatingCable}
            <line
                x1={floatingCable[0].x}
                y1={floatingCable[0].y}
                x2={floatingCable[1].x}
                y2={floatingCable[1].y} />
        {/if}
        <Cable />
    </g>
</svg>
