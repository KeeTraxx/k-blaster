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
</script>

<svelte:window
    on:mouseup={(e) => (dragging = false)}
    on:mousemove={(e) => dragging && mousemove(e)} />
<g transform="translate({x},{y})">
    <g
        transform="translate(-6, -16)"
        on:mousewheel={(e) => handleWheel(e)}
        bind:this={rootEl}>
        <rect width="16" x="-2" y="16" {height} fill="pink" />
        <rect
            on:mousedown={(e) => (dragging = true)}
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
