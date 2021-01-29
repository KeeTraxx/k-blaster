<script>
    import { range } from "d3";
    import Port from "../controls/PortComponent.svelte";
    import Panel from "../controls/Panel.svelte";
    import KeyboardOctave from "../controls/KeyboardOctave.svelte";
    import type { VirtualKeyboard } from "src/lib/VirtualKeyboard";
    export let front: boolean;
    export let device: VirtualKeyboard;
    export let channel = 0;
    export let startOctave = 4;
</script>

<Panel type="VirtualKeyboard" fill="#c2c2c2">
    {#if front}
        <g transform="translate(130,40)">
            {#each range(4) as i}
                <KeyboardOctave
                    {channel}
                    octave={i + startOctave}
                    midiReceiver={device.midiPorts[0].node}
                    x={i * 160}
                />
            {/each}
        </g>
    {:else}
        <Port x={30} y={30} label="MIDI IN" port={device.midiPorts[0]} />
        <Port x={130} y={30} label="MIDI OUT" port={device.midiPorts[1]} />
    {/if}
</Panel>
