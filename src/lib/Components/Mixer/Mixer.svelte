<script lang="ts">
    import { view } from "../../../stores";
    import { port } from "../../Helper/port";
    import { View } from "../types.d";
    import type { Mixer } from "./Mixer";

    export let config : Mixer;
</script>

{#if $view == View.FRONT}
<svg>
    <text x=100 y=100>Mixer</text>
</svg>          
{/if}

{#if $view == View.BACK}
<svg>
    <text x=100 y=100>Mixer back</text>
    <circle cx=100 cy=100 r=5 use:port={config.getPort("out-0")} />
    <circle cx=150 cy=100 r=5 use:port={config.getPort("in-0")} />
</svg>      
{/if}
<style>
    svg {
        flex: 0 0 250px;
    }
</style>