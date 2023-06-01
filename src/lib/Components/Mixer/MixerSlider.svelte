<script lang="ts">
    import Slider from "../../Widgets/Slider/Slider.svelte";

    export let gainNode: GainNode;
</script>

<Slider on:valuechanged={(ev) => gainNode.gain.setValueAtTime(ev.detail, 0)} current={gainNode.gain.value} />

