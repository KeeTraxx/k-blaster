<script lang="ts">
    import type { AudioPort } from "../Components/types";
    import { audioPort } from "./audioport";

    export let p : AudioPort;
    export let x, y;
</script>

<g transform="translate({x},{y})" >
    <circle r=5 use:audioPort={p} />
    <text>{p.name}</text>
</g>