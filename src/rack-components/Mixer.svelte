<script>
    import { range } from "d3";
    import type { AudioPort } from "../types";
    import RackPort from "../controls/RackPort.svelte";
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
        <rect width="960" height="200" fill="#E2E2E2" rx="4" />
        <text x="20" y="20">Mixer</text>
    </g>
{:else}
    <g>
        <rect width="960" height="200" fill="#E2E2E2" />
        <g transform="translate(40,20)">
            <RackPort audioPort={output} label="Mixer Out" />
        </g>
        <g transform="translate(40,50)">
            {#each inputs as input, i}
                <RackPort label="{i+''}" x={i * 30} audioPort={input} />
            {/each}
        </g>
    </g>
{/if}
