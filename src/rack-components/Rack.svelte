<script>
    import { zoom, select } from "d3";
    import { centerPos, svgPos } from "../Util";
    import {
        cables,
        startPort,
        svgStore,
        transform,
    } from "../store/CableStore";

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
    import MidiInput from "./MidiInput.svelte";
    import MidiKeyboard from "./MidiKeyboard.svelte";
    import VirtualKeyboard from "./VirtualKeyboard.svelte";
    export let audioContext: AudioContext;
    export let configuration: {
        devices: Array<{ type: string }>;
        connections: Array<any>;
    };
    export let front: boolean = true;
    let rackEl: SVGGElement;

    const deviceMap: Record<
        string,
        { component: typeof SvelteComponentDev; heightUnits: number }
    > = {
        MasterOutput: { component: MasterOutput, heightUnits: 0.5 },
        Mixer: { component: Mixer, heightUnits: 2 },
        Oscillator: { component: Oscillator, heightUnits: 1 },
        MidiInput: { component: MidiInput, heightUnits: 0.5 },
        MidiKeyboard: { component: MidiKeyboard, heightUnits: 2 },
        VirtualKeyboard: { component: VirtualKeyboard, heightUnits: 2 },
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
    let zoomFactor: number = 1;
    let scrollY: number = 0;
    let scrollX: number = 0;
    onMount(() => {
        const z = zoom<SVGGElement, any>()
            .on("zoom", (e) => {
                zoomFactor = e.transform.k;
                scrollY = e.transform.y;
                scrollX = e.transform.x;
                transform.set(e.transform);
            })
            .scaleExtent([1, 4])
            .translateExtent([
                [0, -960],
                [960, 5000],
            ]);
        select<SVGGElement, any>($svgStore).call(z).on("dblclick.zoom", null);
    });
    function keydown(ev: KeyboardEvent) {
        if (ev.key === "Tab") {
            front = !front;
            ev.preventDefault();
        }
    }
    let tempCable:
        | { x1: number; y1: number; x2: number; y2: number }
        | undefined;

    let mouseMoveListener = (ev: MouseEvent) => {
        if (tempCable) {
            const { x, y } = svgPos(
                {
                    x: (ev.clientX - scrollX) / zoomFactor,
                    y: (ev.clientY - scrollY) / zoomFactor,
                },
                $svgStore
            );
            tempCable.x2 = x;
            tempCable.y2 = y;
        }
    };

    let touchMoveListener = (ev: TouchEvent) => {
        if (tempCable && ev.changedTouches.length === 1) {
            const touch = ev.changedTouches[0];
            const { x, y } = svgPos(
                {
                    x: (touch.clientX - scrollX) / zoomFactor,
                    y: (touch.clientY - scrollY) / zoomFactor,
                },
                $svgStore
            );
            tempCable.x2 = x;
            tempCable.y2 = y;
        }
    };

    startPort.subscribe((port) => {
        if (port !== undefined && port.element) {
            console.log(port.element.getBoundingClientRect());
            const { x, y } = centerPos(
                port.element.getBoundingClientRect(),
                $svgStore
            );
            tempCable = {
                x1: (x - scrollX) / zoomFactor,
                y1: (y - scrollY) / zoomFactor,
                x2: (x - scrollX) / zoomFactor,
                y2: (y - scrollY) / zoomFactor,
            };
            window.addEventListener("mousemove", mouseMoveListener);
            window.addEventListener("touchmove", touchMoveListener);
        } else {
            window.removeEventListener("mousemove", mouseMoveListener);
            window.removeEventListener("touchmove", touchMoveListener);
            tempCable = undefined;
        }
    });
</script>

<style>
    svg {
        background-color: #333;
    }
</style>

<svelte:body on:keydown={keydown} />
<svg
    bind:this={$svgStore}
    class="w-full h-full"
    viewBox="0 0 960 500"
    preserveAspectRatio="xMidYMin meet">
    <Shaders />

    <g
        bind:this={rackEl}
        transform="translate({scrollX}, {scrollY})scale({zoomFactor})">
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
                {#if $cables}
                    <text x="40" y="40">{$cables}</text>
                    {#each $cables as cable}
                        <Cable {...cable} />
                    {/each}
                {/if}
                {#if tempCable}
                    <Cable {...tempCable} />
                {/if}
            </g>
        {/if}
    </g>
</svg>
