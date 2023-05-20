<script lang="ts">
    import type { MidiPort } from "../Components/types.d";
    import { midiPort } from "./midiport";

    export let p : MidiPort;
    export let x, y;
</script>

<g transform="translate({x},{y})" >
    <circle r=5 use:midiPort={p} />
    <text>{p.name}</text>
</g>