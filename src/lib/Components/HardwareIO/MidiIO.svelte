<script lang="ts">
    import MidiPortSvelte from "../../Helper/MidiPort.svelte";
    import { PortDirection, type MidiDevice, type MidiPort } from "../types";
    import type { HardwareIO } from "./HardwareIO";

    export let midiDevice: MidiDevice;
    export let x: number;
    export let y: number;
</script>

<g transform="translate({x},{y})">
    <text>{midiDevice.manufacturer} {midiDevice.name}</text>
    {#if midiDevice.output}
        <MidiPortSvelte x="0" y="10" p={midiDevice.output} />
    {/if}
    {#if midiDevice.input}
        <MidiPortSvelte x="0" y="30" p={midiDevice.input} />
    {/if}
</g>
