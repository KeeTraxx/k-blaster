<script>
    import { scaleLinear } from "d3";
    import { svgScale } from "../Util";

    export let x:number = 0;
    export let y:number = 0;
    export let height: number = 100;
    export let min: number = 0;
    export let max: number = 1;
    export let step: number = (max - min) / 10;
    export let value: number = max;

    let dragging = false;

    const scale = scaleLinear().domain([min, max]).range([height, 0]);

    let rootEl: SVGGraphicsElement;

    function handleWheel(ev: WheelEvent) {
        console.log(ev);
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
        add((-e.movementY * (s || 1)) / height);
    }

    let lastTouchEvent: Touch;

    function touchStart(e:TouchEvent) {
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
            const scaledDelta = -delta * (s || 1) / height;
            add(scaledDelta);
            lastTouchEvent = e.touches[0];
        }
    }
</script>

<svelte:window
    on:mouseup={(e) => (dragging = false)}
    on:mousemove={(e) => dragging && mousemove(e)}
    on:touchstart={(e) => touchStart(e)}
    on:touchmove={(e) => touchmove(e)}
    on:touchend={(e) => dragging = false}
    />
<g transform="translate({x},{y})">
    <g
        transform="translate(-6, -16)"
        on:mousewheel={(e) => handleWheel(e)}
        bind:this={rootEl}>
        <rect width="16" x="-2" y="16" {height} fill="pink" />
        <rect
            on:mousedown={(e) => (dragging = true)}
            on:touchstart={(e) => (dragging = true)}
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
