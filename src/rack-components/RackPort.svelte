<script>
    import { end, start } from "./Rack.svelte";
    import type { AudioPort } from "../types";
    export let audioPort: AudioPort<AudioNode>;
    export let x:number = 0,y:number = 0;
</script>

<circle
    r=5
    cx={x} cy={y}
    bind:this={audioPort.element}
    on:mousedown={(e) => start(e, audioPort)}
    on:mouseup={(e) => end(e, audioPort)} />
