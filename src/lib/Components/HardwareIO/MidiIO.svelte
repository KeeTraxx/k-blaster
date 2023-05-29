<script lang="ts">
    import MidiPortSvelte from "../../Helper/MidiPort.svelte";
    import { PortDirection, type MidiDevice, type MidiPort } from "../types";
    import type { HardwareIO } from "./HardwareIO";

    export let midiDevice: MidiDevice;
    export let hardwareIO: HardwareIO;
    export let x: number;
    export let y: number;

    const midiOutput: MidiPort = {
        componentId: hardwareIO.id,
        direction: PortDirection.IN,
        midi: midiDevice.output,
        name: `${midiDevice.name}-OUT`
    }

    const midiInput: MidiPort = {
        componentId: hardwareIO.id,
        direction: PortDirection.OUT,
        midi: midiDevice.input,
        name: `${midiDevice.name}-IN`
    }
</script>

<g transform="translate({x},{y})">
    <text>{midiDevice.manufacturer} {midiDevice.name}</text>
    {#if midiDevice.output}
        <MidiPortSvelte x="0" y="10" p={midiOutput} />
    {/if}
    {#if midiDevice.input}
        <MidiPortSvelte x="0" y="30" p={midiInput} />
    {/if}
</g>
