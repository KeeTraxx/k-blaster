<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { scaleLinear } from "d3";

    export let min = 0;
    export let max = 1;
    export let step = 0.1;
    export let current = 1;

    let scale = scaleLinear().domain([0, 250]).range([min, max]).clamp(true);

    let captureEl: SVGRectElement;
    let slider: SVGGElement;
    let sliderRect: DOMRect = new DOMRect();
    let groove: SVGGElement;
    let grooveRect: DOMRect = new DOMRect();
    let allRect: DOMRect = new DOMRect();
    const dispatch = createEventDispatcher<{ valuechanged: number }>();

    function increment() {
        current = Math.min(max, current + step);
        dispatch("valuechanged", current);
    }

    function decrement() {
        current = Math.max(min, current - step);
        dispatch("valuechanged", current);
    }

    const mouseMoveHandler = (ev: MouseEvent) => {
        moveTo(ev);
        dispatch("valuechanged", current);
    };

    const touchMoveHandler = (ev: TouchEvent) => {
        moveTo(ev.touches[0]);
        dispatch("valuechanged", current);
    };

    function moveTo(ev: MouseEvent | Touch) {
        console.log(ev.clientY - grooveRect.top, scale.domain());
        current = scale(ev.clientY - grooveRect.top);
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
        sliderRect = slider.getBoundingClientRect();
        grooveRect = groove.getBoundingClientRect();
        allRect = {
            x: 0,
            y: 0,
            top: grooveRect.top - sliderRect.height / 2,
            right: grooveRect.left / 2 + grooveRect.right / 2 + sliderRect.width / 2,
            bottom: grooveRect.bottom + sliderRect.height /2,
            left: grooveRect.left / 2 + grooveRect.right / 2 - sliderRect.width / 2,
            height: grooveRect.height + sliderRect.height,
            width: sliderRect.width,
            toJSON: () => ""
        };
        console.log(allRect);
        scale.domain([grooveRect.height, 0]);

        scale = scale.copy();
    });
</script>

<text x="20" y="20">{current}</text>
<g bind:this={groove}>
    <slot name="groove">
        <rect x=-5 width="10" height="100" />
    </slot>
</g>
<g bind:this={slider} transform="translate(0,{scale.invert(current)})">
    <slot name="slider">
        <circle r="5" />
    </slot>
</g>

<rect
    bind:this={captureEl}
    x={-allRect.width / 2}
    y={-sliderRect.height / 2}
    width={allRect.width}
    height={allRect.height}
    class="capture"
    on:wheel={(ev) => {
        ev.preventDefault();
        ev.deltaY < 0 ? increment() : decrement();
    }}
    on:mousedown={() => startDrag()}
    on:touchstart={() => startDrag()}
/>

<style>
    .capture {
        fill: rgba(255, 128, 128, 0.3);
    }
</style>
