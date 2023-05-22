<script lang="ts">
    import { view } from "../../../stores";
    import AudioPort from "../../Helper/AudioPort.svelte";
    import MidiPort from "../../Helper/MidiPort.svelte";
    import { PortDirection, View } from "../types";
    import type { Oscillator } from "./Oscillator";

    export let config: Oscillator;
</script>

{#if $view == View.FRONT}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="100" y="100">Oscillator</text>
        <rect width=100 height=100 fill=blue on:click={ev => config.play()}></rect>
    </svg>
{/if}

{#if $view == View.BACK}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="0" y="20">Oscillator back</text>
        <AudioPort x="100" y="100" p={config.getAudioPort("out-0")}/>
        <MidiPort x="200" y="100" p={config.getMidiPort("in-0")}/>

    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
