<script lang="ts">
    import Slider from "../../Widgets/Slider/Slider.svelte";

    export let gainNode: GainNode;
    export let x = 0;
    export let y = 0;
</script>

<g transform="translate({x},{y})">
    <Slider
        on:valuechanged={(ev) => gainNode.gain.setValueAtTime(ev.detail, 0)}
        current={gainNode.gain.value}
    >
    <circle r=20 slot="slider" />
</Slider>

</g>
