<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let min = 0;
    export let max = 1;
    export let step = 0.1;
    export let width = 100;
    export let height = 250;
    export let current = 1;

    const dispatch = createEventDispatcher<{valuechanged: number}>();

    function increment() {
        current = Math.min(max, current + step);
    }

    function decrement() {
        current = Math.max(min, current - step);
    }

</script>

<rect {width} {height} class="capture" on:mousewheel={(ev) => ev.deltaY < 0 ? increment() : decrement() }></rect>
<text x=20 y=20>{current}</text>

<style>
.capture {
    fill: rgba(0,0,0,0);
}
</style>