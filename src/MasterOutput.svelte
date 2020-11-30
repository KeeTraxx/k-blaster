<script>
    import RackPort from "./RackPort.svelte";
    import type { AudioPort } from "./types";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const inputs: Array<AudioPort<GainNode>> = [
        Object.assign(audioContext.createGain(), { isOutput: false }),
    ];
    inputs[0].connect(audioContext.destination);
</script>

{#if front}
    <g>
        <rect width="960" height="50" fill="rgba(255,0,0,0.1)" />
        <text x="20" y="20">MasterOut</text>
    </g>
{:else}
    <g>
        <g transform="translate(20,20)">
            <RackPort audioPort={inputs[0]} />
        </g>
    </g>
{/if}
