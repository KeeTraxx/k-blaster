<script lang="ts">
    import { audioContext } from "../../../stores";
    import { audioIn, audioOut } from "../../Helper/port";
    import { View } from "../types.d";

    export let view : View;

    let audioOutNode = $audioContext.createGain();
    let audioInNode = $audioContext.createGain();
</script>

{#if view == View.FRONT}
<svg>
    <text x=100 y=100>Mixer</text>
</svg>      
{/if}

{#if view == View.BACK}
<svg>
    <text x=100 y=100>Mixer back</text>
    <circle cx=50 cy=50 r=10 use:audioOut={audioOutNode}></circle>
    <circle cx=100 cy=50 r=10 use:audioIn={audioInNode}></circle>
</svg>      
{/if}
