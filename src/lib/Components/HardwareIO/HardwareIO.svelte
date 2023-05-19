<script lang="ts">
    import { view } from "../../../stores";
    import Port from "../../Helper/AudioPort.svelte";
    import { PortDirection, View } from "../types.d";
    import type { HardwareIO } from "./HardwareIO";

    export let config: HardwareIO;
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
        <Port x="100" y="100" p={config.getAudioPort("default-in")}/>
    </svg>
{/if}

<style>
    svg {
        flex: 0 0 250px;
    }
</style>
