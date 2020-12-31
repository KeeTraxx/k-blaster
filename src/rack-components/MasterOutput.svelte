<script>
    import Port from "../controls/Port.svelte";
    import { onMount } from "svelte";

    import type { AudioPort } from "../types";
import DigitalDisplay from "../controls/DigitalDisplay.svelte";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const inputs: Array<AudioPort<GainNode>> = [
        Object.assign(audioContext.createGain(), { isOutput: false }),
    ];
    let outputDevices: Array<MediaDeviceInfo> = [];
    let selectedDeviceIndex: number = 0;
    const audio = new Audio();

    onMount(async () => {
        await navigator.mediaDevices.getUserMedia({ audio: {} });
        const devs = await navigator.mediaDevices.enumerateDevices();
        outputDevices = devs.filter((d) => d.kind === "audiooutput");
        selectedDeviceIndex = outputDevices.findIndex(
            (d) => d.deviceId === "default"
        );
        const node = audioContext.createMediaStreamDestination();
        inputs[0].connect(node);

        audio.srcObject = node.stream;
        audio.play();

        console.log(audio);
    });

    $: {
        console.log("selectedDevice", selectedDeviceIndex);
        // @ts-ignore
        audio.setSinkId(outputDevices[selectedDeviceIndex]?.deviceId);
    }

    function next() {
        console.log('next', selectedDeviceIndex);
        selectedDeviceIndex = (selectedDeviceIndex + 1) % outputDevices.length;

    }
</script>
<style>
    text {
        pointer-events: none;
        user-select: none;
    }
</style>

{#if front}
    <g on:click={() => next()} >
        <rect
            width="960"
            height="50"
            fill="#eee"
            rx={3}
            />
        <rect x="525" y="5" width=150 height=20 fill="#f44" stroke="#fff"></rect>
        <text x="530" y="20" width=500 height=20 fill="#fff">Next audio device</text>
        <DigitalDisplay x={20} y={20} text={outputDevices[selectedDeviceIndex]?.label}></DigitalDisplay>
        <text x="900" y="40" fill="white">MasterOut</text>
    </g>
{:else}
    <g>
        <rect width="960" height="50" fill="#eee" />
        <g transform="translate(100,20)">
            <Port x={50} node={inputs[0]} isOutput={false} label="Input" type="audio" />
        </g>
    </g>
{/if}
