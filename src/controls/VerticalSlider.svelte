<script>
    import { scaleLinear } from "d3";
    import { svgScale } from "../Util";

    export let x: number = 0;
    export let y: number = 0;
    export let height: number = 100;
    const sliderWindow = height - 36;
    export let min: number = 0;
    export let max: number = 1;
    export let step: number = (max - min) / 10;
    export let value: number = max;

    let dragging = false;

    const scale = scaleLinear().domain([min, max]).range([sliderWindow, 0]);

    let rootEl: SVGGraphicsElement;

    function handleWheel(ev: WheelEvent) {
        if (ev.deltaY < 0) {
            add(step);
        }
        if (ev.deltaY > 0) {
            add(-step);
        }
    }

    function add(d: number) {
        value += d;
        value = Math.max(min, Math.min(max, value));
    }

    function mousemove(e: MouseEvent) {
        const s = svgScale(rootEl);
        add((-e.movementY * (s || 1)) / sliderWindow);
    }

    let lastTouchEvent: Touch;

    function touchStart(e: TouchEvent) {
        if (e.touches.length === 1) {
            lastTouchEvent = e.touches[0];
            dragging = true;
        }
    }

    function touchmove(e: TouchEvent) {
        if (dragging && lastTouchEvent && e.touches.length === 1) {
            const currentTouchEvent = e.touches[0];
            const delta = currentTouchEvent.clientY - lastTouchEvent.clientY;
            const s = svgScale(rootEl);
            const scaledDelta = (-delta * (s || 1)) / sliderWindow;
            add(scaledDelta);
            lastTouchEvent = e.touches[0];
        }
    }
</script>

<style>
    line {
        stroke: black;
        stroke-width: 3px;
        stroke-linecap: round;
    }
</style>

<svelte:window
    on:mouseup|preventDefault|stopPropagation={(e) => (dragging = false)}
    on:mousemove|preventDefault|stopPropagation={(e) => dragging && mousemove(e)}
    on:touchstart|preventDefault|stopPropagation={(e) => touchStart(e)}
    on:touchmove|preventDefault|stopPropagation={(e) => touchmove(e)}
    on:touchend|preventDefault|stopPropagation={(e) => (dragging = false)} />
<g transform="translate({x},{y})">
    <g
        transform="translate(2,2)"
        on:mousewheel|preventDefault|stopPropagation={(e) => handleWheel(e)}
        bind:this={rootEl}>
        <rect width="15" height={height} fill="rgba(0,0,0,0)" />
        <line x1="6" y1="16" x2="6" y2={height-20} />
        <rect
            on:mousedown|preventDefault|stopPropagation={(e) => (dragging = true)}
            on:touchstart|preventDefault|stopPropagation={(e) => (dragging = true)}
            transform="translate(0,{scale(value)})"
            width="12"
            height="32"
            fill="url(#linearGradient855)"
            filter="url(#filter1648)"
            stroke="#000"
            stroke-linecap="round"
            stroke-width=".26458" />
    </g>
</g>
