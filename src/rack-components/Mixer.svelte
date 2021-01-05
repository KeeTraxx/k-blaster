<script>
    import { range } from "d3";
    import type { AudioPort } from "../types";
    import GainControl from "../controls/GainControl.svelte";
    import Port from "../controls/Port.svelte";
    import Panel from "../controls/Panel.svelte";
    export let audioContext: AudioContext;
    export let front: boolean;
    const output: AudioPort<GainNode> = Object.assign(
        audioContext.createGain(),
        {
            isOutput: true,
        }
    );

    const inputs: Array<GainNode> = range(8).map((i) =>
        audioContext.createGain()
    );
    inputs.forEach((i) => i.connect(output));
</script>

<Panel type="Mixer" fill="#c2c2c2">
    {#if front}
        <GainControl
            x={5}
            y={5}
            height={180}
            label="Master"
            gainNode={output}
            {audioContext} />
        {#each inputs as input, i}
            <GainControl
                x={70 + 50 * i}
                y={35}
                height={150}
                label="Input {i + 1}"
                gainNode={input}
                {audioContext} />
        {/each}
    {:else}
        <rect width="960" height="200" fill="#c2c2c2" />
        <g transform="translate(40,30)">
            <Port
                node={output}
                isOutput={true}
                label="Mixer Out"
                type="audio" />
        </g>
        <g transform="translate(80,100)">
            {#each inputs as input, i}
                <Port
                    label="Input {i + 1}"
                    x={i * 50}
                    node={input}
                    type="audio"
                    isOutput={false} />
            {/each}
        </g>
    {/if}
</Panel>
