<script>
import { onMount } from "svelte";

    import RackPort from "../controls/RackPort.svelte";
    import type { AudioPort } from "../types";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const inputs: Array<AudioPort<GainNode>> = [
        Object.assign(audioContext.createGain(), { isOutput: false }),
    ];
    inputs[0].connect(audioContext.destination);
    onMount(async () => {
        const devs = await navigator.mediaDevices.enumerateDevices();
        console.log(devs);
    });
    
</script>

{#if front}
    <g>
        <rect width="960" height="50" fill="#eee" rx={3} />
        <text x="900" y="40" fill="white">MasterOut</text>
    </g>
{:else}
    <g>
        <rect width="960" height="50" fill="#eee" />
        <g transform="translate(20,20)">
            <RackPort audioPort={inputs[0]} />
        </g>
    </g>
{/if}
