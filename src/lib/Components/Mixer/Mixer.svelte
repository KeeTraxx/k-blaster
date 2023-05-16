<script lang="ts">
    import { view } from "../../../stores";
    import Port from "../../Helper/Port.svelte";
    import { PortDirection, View } from "../types.d";
    import type { Mixer } from "./Mixer";

    export let config: Mixer;
</script>

{#if $view == View.FRONT}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="100" y="100">Mixer</text>
    </svg>
{/if}

{#if $view == View.BACK}
    <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
        <rect width="960" height="250" fill="grey" />
        <text x="100" y="100">Mixer back</text>
        <g transform="translate(50,50)">
            {#each [...config.ports].filter(d => d.direction === PortDirection.IN) as p, i}
                <Port x={50 * i} y="20" {p} />
            {/each}
        </g>

        <Port x="100" y="100" p={config.getPort("out-0")}/>
    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
