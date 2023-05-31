<script lang="ts">
    import { onDestroy } from "svelte";
    import type { MidiPort } from "../Components/types";
    import { midiPort } from "./midiport";

    export let p: MidiPort;
    export let x, y;

    console.log('p', p);

    let activity = false;

    let activityTimeout;

    const activityHandler = () => {
        activity = true;
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(() => activity = false, 100);
    };
    p.midi.addEventListener("midimessage", activityHandler);    

    onDestroy(() => {
        p.midi.removeEventListener("midimessage", activityHandler);
    });
</script>

<g transform="translate({x},{y})">
    <circle r="5" use:midiPort={p} />
    {#if activity}
        <circle r="6" class="activity"></circle>
    {/if}
    
    <text y="15">{p.name}</text>
</g>

<style>
    text {
        text-anchor: middle;
    }

    .activity {
        fill: green;
        pointer-events: none;
    }
</style>