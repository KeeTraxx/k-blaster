<script>
    import { range } from "d3";
    import type { AudioPort } from "../types";
    import RackPort from "../controls/RackPort.svelte";
    import GainControl from "../controls/GainControl.svelte";
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
<rect width="960" height="200" fill="#E2E2E2" rx="4" />
<GainControl x={5} y={5} height={190} label="Master" gainNode={output} {audioContext} />
{#each inputs as input,i}
<GainControl x={70 + 50*i} y={35} height={160} label="Input {i+1}" gainNode={input} {audioContext} />
{/each}
{:else}
    <g>
        <rect width="960" height="200" fill="#E2E2E2" />
        <g transform="translate(40,20)">
            <RackPort audioPort={output} label="Mixer Out" />
        </g>
        <g transform="translate(40,100)">
            {#each inputs as input, i}
                <RackPort label="Input {i}" x={i * 50} audioPort={input} />
            {/each}
        </g>
    </g>
{/if}
