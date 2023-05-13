<script lang="ts">
    import { cableport } from "../../Helper/port";
    import { View } from "../types.d";

    export let view : View;
</script>

{#if view == View.FRONT}
<svg>
    <text x=100 y=100>Mixer</text>
</svg>      
{/if}

{#if view == View.BACK}
<svg>
    <text x=100 y=100 use:cableport>Mixer back</text>
</svg>      
{/if}
