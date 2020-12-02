<script>
    export let x:number;
    export let y:number;
    export let height: number = 100;
    export let min: number = 0;
    export let max: number = 100;
    export let value: number = max;
</script>

<style>
</style>

<g transform="translate({x},{y})">
    <g transform="translate(-6, -16)">
        <rect width="16" x="-2" {height} fill="pink" />
        <rect
            width="12"
            height="32"
            fill="url(#linearGradient855)"
            filter="url(#filter1648)"
            stroke="#000"
            stroke-linecap="round"
            stroke-width=".26458" />
    </g>
</g>
