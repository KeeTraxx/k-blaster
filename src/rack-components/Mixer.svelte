<script>
    import { range } from "d3";
    import type { AudioPort } from "../types";
    import RackPort from "./RackPort.svelte";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const output: AudioPort<GainNode> = Object.assign(
        audioContext.createGain(),
        {
            isOutput: true,
        }
    );
    export const inputs: Array<AudioPort<GainNode>> = range(8).map((i) =>
        Object.assign(audioContext.createGain(), {
            connections: [],
            isOutput: false,
        })
    );

    inputs.forEach((i) => i.connect(output));
</script>

{#if front}
    <g>
        <rect width="960" height="200" fill="rgba(0,0,255,0.1)" />
        <text x="20" y="20">Mixer</text>
    </g>
{:else}
    <g>
        <text x="20" y="20">Back</text>
        <g transform="translate(20,20)">
            <RackPort audioPort={output} />
        </g>
        <g transform="translate(20,50)">
            {#each inputs as input, i}
                <RackPort x={i * 30} audioPort={input} />
            {/each}
        </g>
    </g>
{/if}
