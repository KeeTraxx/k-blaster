<script context="module">
    import { writable } from "svelte/store";
    import { centerPos, svgPos } from "../Util";
    import type { AudioPort } from "../types";
    let other: AudioPort<AudioNode> | null;
    const cableStore: any = writable<Array<[AudioPort, AudioPort]>>([]);

    export function start(port: AudioPort) {
        console.log("start");
        // check connections
        if (port.connection) {
            console.log("disconnect!!");
            other = port.connection;
            if (other === null) {
                return;
            }
            if (other.isOutput) {
                other.disconnect(port);
                cableStore.update(
                    (cableStore: Array<[AudioPort, AudioPort]>) => {
                        const index = cableStore.findIndex(
                            (c) => c[0] === other
                        );
                        if (index > -1) {
                            cableStore.splice(index, 1);
                        }
                        return cableStore;
                    }
                );
            } else {
                port.disconnect(other);
                cableStore.update(
                    (cableStore: Array<[AudioPort, AudioPort]>) => {
                        const index = cableStore.findIndex(
                            (c) => c[0] === port
                        );
                        if (index > -1) {
                            cableStore.splice(index, 1);
                        }
                        return cableStore;
                    }
                );
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
    export function end(toPort: AudioPort<AudioNode> | undefined) {
        console.log("end", toPort);
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
            cableStore.update((cableStore) => {
                console.log("update", output, input);
                cableStore.push([output, input]);
                return cableStore;
            });
        }
        other = null;
        cableStore.update((cableStore) => cableStore);
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
            floatCable(ev.clientX, ev.clientY);
        } else {
            floatingCable = undefined;
        }
    }

    function touchMove(ev: TouchEvent) {
        if (
            other?.element !== undefined &&
            svg !== null &&
            ev.touches.length === 1
        ) {
            floatCable(ev.touches[0].clientX, ev.touches[0].clientY);
        } else {
            floatingCable = undefined;
        }
    }

    function floatCable(clientX: number, clientY: number) {
        if (other?.element !== undefined) {
            const rect: DOMRect = other.element.getBoundingClientRect();
            floatingCable = [
                centerPos(rect, svg),
                svgPos({ x: clientX, y: clientY }, svg),
            ];
        } else {
            floatingCable = undefined;
        }
    }

    let cables: Array<{
        from: { x: number; y: number };
        to: { x: number; y: number };
    }> = [];

    cableStore.subscribe(() => {
        const connectedPorts: Array<[AudioPort, AudioPort]> = [
            ...$cableStore.values(),
        ];
        cables = connectedPorts.map(([from, to]) => ({
            from: centerPos(from.element.getBoundingClientRect(), svg),
            to: centerPos(to.element.getBoundingClientRect(), svg),
        }));
        reset();
    });
</script>

<style>
    .cables line {
        stroke: red;
        stroke-width: 5px;
        filter: url(#cable);
        stroke-linecap: round;
        pointer-events: none;
    }
    svg {
        background-color: #333;
    }
</style>

<svelte:body on:keydown={keydown} />
<svg
    on:mouseup={(e) => reset()}
    on:mousemove={mouseMove}
    on:touchmove={touchMove}
    on:touchend={(e) => reset()}
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
    {#if !front}
        <g class="cables">
            {#each cables as cable}
                <Cable
                    x1={cable.from.x}
                    y1={cable.from.y}
                    x2={cable.to.x}
                    y2={cable.to.y} />
            {/each}
            {#if floatingCable && other}
                <Cable
                    x1={floatingCable[0].x}
                    y1={floatingCable[0].y}
                    x2={floatingCable[1].x}
                    y2={floatingCable[1].y} />
            {/if}
        </g>
    {/if}
</svg>
