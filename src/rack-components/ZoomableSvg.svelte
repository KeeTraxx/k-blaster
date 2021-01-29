<script>
import { select, zoom } from "d3";
import { onMount } from "svelte";

    import {
        svgStore,
        transform
    } from "../store/CableStore";

    onMount(() => {
        const z = zoom<SVGGElement, any>()
            .on("zoom", (e) => {
                $transform = e.transform;
            })
            .scaleExtent([0.5, 4]);
        select<SVGGElement, any>($svgStore).call(z).on("dblclick.zoom", null);
    });
</script>


<svg
    bind:this={$svgStore}
    class="w-full h-full"
    viewBox="0 0 960 500"
    preserveAspectRatio="xMidYMin meet">
    <g transform="translate({$transform.x}, {$transform.y})scale({$transform.k})">
      <slot />
    </g>
</svg>