<script lang="ts">
    import { view } from "../../../stores";
    import Port from "../../Helper/AudioPort.svelte";
    import { PortDirection, View } from "../types";
    import type { Mixer } from "./Mixer";
    import MixerLevelDisplay from "./MixerLevelDisplay.svelte";
    import MixerSlider from "./MixerSlider.svelte";

    export let config: Mixer;

    $: inports = [...config.audioPorts].filter(
        (d) => d.direction === PortDirection.IN
    );
</script>

{#if $view == View.FRONT}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="100" y="100">Mixer</text>
        <g transform="translate(5)">
            {#each inports as p, i (p.name)}
                <g transform="translate({i * 100})">
                    <MixerLevelDisplay audioContext={config.audioContext} audioNode={p.audioNode} />
                    <rect
                        width="95"
                        height="250"
                        rx="5"
                        style="fill: none; stroke: white; stroke-width: 3px"
                    />
                    <MixerSlider gainNode={p.audioNode} />
                </g>
            {/each}
        </g>
    </svg>
{/if}

{#if $view == View.BACK}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="0" y="20">Mixer back</text>
        <g transform="translate(5)">
            {#each inports as p, i (p.name)}
                <g transform="translate({i * 100})">
                    <rect
                        width="95"
                        height="250"
                        rx="5"
                        style="fill: none; stroke: white; stroke-width: 3px"
                    />
                    <Port x="40" y="200" {p} />
                </g>
            {/each}
        </g>
        <Port x="880" y="200" p={config.getAudioPort("out-0")} />
    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
