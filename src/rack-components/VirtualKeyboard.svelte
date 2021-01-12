<script>
    import {range} from 'd3';
    import Port from "../controls/Port.svelte";
    import Panel from "../controls/Panel.svelte";
    import { MidiReceiver } from "../lib/MidiReceiver";
    import KeyboardOctave from "../controls/KeyboardOctave.svelte";
    export let front: boolean;
    let octave = 4;
    let channel = 0;

    const midiReceiver: MidiReceiver = new MidiReceiver();
    const midiEmitter: MidiReceiver = new MidiReceiver();
    midiReceiver.on("midimessage", (e) => midiEmitter.emit("midimessage", e));
</script>

<Panel type="VirtualKeyboard" fill="#c2c2c2">
    {#if front}
        <g transform="translate(130,40)">
            {#each range(4) as i}
                <KeyboardOctave {channel} octave={i+octave} {midiReceiver} x={i*160} />
            {/each}
        </g>
    {:else}
        <Port
            type="midi"
            x={30}
            y={30}
            isOutput={false}
            node={midiReceiver}
            label="MIDI IN" />
        <Port
            type="midi"
            x={130}
            y={30}
            isOutput={true}
            node={midiEmitter}
            label="MIDI OUT" />
    {/if}
</Panel>
