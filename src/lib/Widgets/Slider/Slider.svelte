<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { scaleLinear } from "d3";

    export let min = 0;
    export let max = 1;
    export let step = 0.1;
    export let width = 100;
    export let height = 250;
    export let current = 1;

    let captureEl: SVGRectElement;

    const dispatch = createEventDispatcher<{ valuechanged: number }>();

    function increment() {
        current = Math.min(max, current + step);
    }

    function decrement() {
        current = Math.max(min, current - step);
    }

    const mouseMoveHandler = (ev: MouseEvent) => {
        moveTo(ev);
    };

    const touchMoveHandler = (ev: TouchEvent) => {
        moveTo(ev.touches[0]);
    };

    const scale = scaleLinear()
        .domain([0, height])
        .range([min, max])
        .clamp(true);

    function moveTo(ev: MouseEvent | Touch) {
        current = scale(ev.clientY);
    }

    function startDrag() {
        document.addEventListener("mouseup", stopDrag, { once: true });
        document.addEventListener("mouseleave", stopDrag, { once: true });
        document.addEventListener("touchend", stopDrag, { once: true });
        document.addEventListener("touchcancel", stopDrag, { once: true });
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("touchmove", touchMoveHandler);
    }

    function stopDrag() {
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("mouseleave", stopDrag);
        document.removeEventListener("touchend", stopDrag);
        document.removeEventListener("touchcancel", stopDrag);
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("touchmove", touchMoveHandler);
    }

    onMount(() => {
        const rect = captureEl.getBoundingClientRect();
        scale.domain([rect.bottom, rect.top]);
    });
</script>

<rect
    bind:this={captureEl}
    {width}
    {height}
    class="capture"
    on:wheel={(ev) => (ev.deltaY < 0 ? increment() : decrement())}
    on:mousedown={() => startDrag()}
    on:touchstart={() => startDrag()}
/>
<text x="20" y="20">{current}</text>

<style>
    .capture {
        fill: rgba(0, 0, 0, 0);
    }
</style>
