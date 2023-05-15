<script lang="ts">
    import { audioContext, view } from "../../../stores";
    import { audioIn, audioOut } from "../../Helper/port";
    import { View } from "../types.d";

    export let id: string;

    let audioOutNode = $audioContext.createGain();
    let audioInNode = $audioContext.createGain();
</script>

<svg style="display: {$view == View.FRONT ? 'inherit': 'none'}">
    <text x=100 y=100>Mixer</text>
</svg>      

<svg style="display: {$view == View.BACK ? 'inherit': 'none'}">
    <text x=100 y=100>Mixer back</text>
    <circle cx=50 cy=50 r=10 use:audioOut={{componentId: id, name: 'out-0', audioNode: audioOutNode}}></circle>
    <circle cx=100 cy=50 r=10 use:audioIn={{componentId: id, name: 'in-0', audioNode: audioInNode}}></circle>
</svg>      

<style>
    svg {
        flex: 0 0 250px;
    }
</style>