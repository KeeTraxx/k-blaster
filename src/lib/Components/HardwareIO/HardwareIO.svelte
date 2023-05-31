<script lang="ts">
    import { onDestroy } from "svelte";
    import { view } from "../../../stores";
    import AudioPort from "../../Helper/AudioPort.svelte";
    import { type MidiDevice, View } from "../types";
    import type { HardwareIO } from "./HardwareIO";
    import MidiIo from "./MidiIO.svelte";

    export let config: HardwareIO;
    let midiDevices: Array<MidiDevice> = [...config.midiDevices.values()];
    const statechangeHandler = () => {
        setTimeout(() => {
            midiDevices = [...config.midiDevices.values()];
            console.log("updated?");
        }, 100);
    };
    config.events.addEventListener("statechange", statechangeHandler);
    onDestroy(() => {
        config.events.removeEventListener("statechange", statechangeHandler);
    });
</script>

{#if $view == View.FRONT}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="100" y="100">HardwareIO</text>
    </svg>
{/if}

{#if $view == View.BACK}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="0" y="20">HardwareIO</text>
        <AudioPort x="100" y="100" p={config.getAudioPort("default-in")} />
        {#each midiDevices as dev, i}
            <MidiIo
                x={200 + 50 * i}
                y={100}
                midiDevice={dev}
            />
        {/each}
    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
