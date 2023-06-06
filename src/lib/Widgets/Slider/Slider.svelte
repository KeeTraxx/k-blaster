<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { scaleLinear } from "d3";

    export let min = 0;
    export let max = 1;
    export let step = 0.1;
    export let current = 1;

    const scale = scaleLinear()
        .domain([0, 250])
        .range([min, max])
        .clamp(true);

    let invertScale = scaleLinear();


    let captureEl: SVGRectElement;
    let slider: SVGGElement;
    let sliderRect: DOMRect;
    let groove: SVGGElement;
    let grooveRect: DOMRect;
    let all: SVGGElement;
    let allRect: DOMRect = {height: 250, width: 100, bottom: 250, left: 0, right: 100, top: 0, x: 0, y:0};

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
        console.log(ev.clientY, scale.domain());
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
        sliderRect = slider.getBoundingClientRect();
        grooveRect = groove.getBoundingClientRect();
        allRect = all.getBoundingClientRect();
        console.log(allRect);
        scale.domain([allRect.bottom + sliderRect.height / 2, allRect.top + sliderRect.height / 2]);

        
        padding = sliderRect.height / 2;
        invertScale = scaleLinear()
            .domain([min, max])
            .range([allRect.height - padding, padding])
            .clamp(true);
    });

    let padding = 5;
</script>


<text x="20" y="20">{current}</text>
<g bind:this={all}>
    <g bind:this={groove}>
        <slot name="groove">
            <rect width="10" height=100 />
        </slot>
    </g>
    <g bind:this={slider} transform=translate(0,{invertScale(current)}) >
        <slot name="slider">
            <circle r="5" />
        </slot>
    </g>
</g>

<rect
    bind:this={captureEl}
    x={-allRect.width / 2}
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
