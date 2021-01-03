<script>
    import Port from "../controls/Port.svelte";
    import { onMount } from "svelte";

    import type { AudioPort } from "../types";
import DigitalDisplay from "../controls/DigitalDisplay.svelte";
import SvgButton from "../controls/SvgButton.svelte";
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
        // @ts-ignore
        audio.setSinkId(outputDevices[selectedDeviceIndex]?.deviceId);
    }

    function next() {
        selectedDeviceIndex++;
        selectedDeviceIndex = selectedDeviceIndex % outputDevices.length;
    }

    function previous() {
        selectedDeviceIndex--;
        if (selectedDeviceIndex === -1) {
            selectedDeviceIndex = outputDevices.length-1;
        }
    }
</script>
<style>
    text {
        pointer-events: none;
        user-select: none;
    }
</style>

{#if front}
    <g>
        <rect
            width="960"
            height="50"
            fill="#eee"
            rx={3}
            />
        <g transform="translate(20,20)">
            <SvgButton text="◀" on:click={() => next()} />
            <DigitalDisplay x={32} text={outputDevices[selectedDeviceIndex]?.label} />
            <SvgButton x={180} text="▶" on:click={() => previous()} />
        </g>
    </g>
{:else}
    <g>
        <rect width="960" height="50" fill="#eee" />
        <g transform="translate(100,20)">
            <Port x={50} node={inputs[0]} isOutput={false} label="Input" type="audio" />
        </g>
    </g>
{/if}
