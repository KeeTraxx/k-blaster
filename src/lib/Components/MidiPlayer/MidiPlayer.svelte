<script lang="ts">
    import { view } from "../../../stores";
    import MidiPort from "../../Helper/MidiPort.svelte";
    import { View } from "../types.d";
    import type { MidiPlayer } from "./MidiPlayer";

    export let config: MidiPlayer;

    function filedrop(el: Element) {
        const drop = async (ev: DragEvent) => {
            ev.preventDefault();
            const buf = await ev.dataTransfer.items[0].getAsFile().arrayBuffer();
            config.load(buf);
        };
        el.addEventListener("drop", drop);
        el.addEventListener("dragover", (ev) => ev.preventDefault());
        return {
            destroy() {},
        };
    }
</script>

{#if $view == View.FRONT}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" use:filedrop />
        <text x="100" y="100">MidiPlayer</text>
    </svg>
{/if}

{#if $view == View.BACK}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="0" y="20">MidiPlayer back</text>
        <MidiPort x="100" y="100" p={config.getMidiPort("out-0")} />
    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
