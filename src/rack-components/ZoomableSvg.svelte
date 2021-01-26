<script>
import { select, zoom } from "d3";
import { onMount } from "svelte";

    import {
        cables,
        startPort,
        svgStore,
        transform
    } from "../store/CableStore";

    let zoomFactor: number = 1;
    let scrollY: number = 0;
    let scrollX: number = 0;
    onMount(() => {
        const z = zoom<SVGGElement, any>()
            .on("zoom", (e) => {
                zoomFactor = e.transform.k;
                scrollY = e.transform.y;
                scrollX = e.transform.x;
                transform.set(e.transform);
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
    <g transform="translate({scrollX}, {scrollY})scale({zoomFactor})">
      <slot />
    </g>
</svg>