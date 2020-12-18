<script>
    import { onMount } from "svelte";

    import RackPort from "../controls/RackPort.svelte";
    export let front: boolean;
   
</script>
<style>
    text {
        pointer-events: none;
        user-select: none;
    }
</style>

{#if front}
    <g>
        <rect
            width="960"
            height="200"
            fill="#eee"
            rx={3}
            />
    </g>
{:else}
    <g>
        <rect width="960" height="200" fill="#eee" />
        <g transform="translate(100,20)">
        </g>
    </g>
{/if}
