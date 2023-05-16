<script lang="ts">
    import type { Port } from "../Components/types";
    import { port } from "./port";

    export let p : Port;
    export let x, y;
</script>

<g transform="translate({x},{y})" >
    <circle r=5 use:port={p} />
    <text>{p.name}</text>
</g>