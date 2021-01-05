<script>
    import Port from "../controls/Port.svelte";
    import Panel from "../controls/Panel.svelte";
    import { MidiReceiver } from "../lib/MidiReceiver";
    export let front: boolean;

    const midiReceiver: MidiReceiver = new MidiReceiver();
    const midiEmitter: MidiReceiver = new MidiReceiver();
    midiReceiver.on('midimessage', e => midiEmitter.emit("midimessage", e));
</script>

<Panel type="VirtualKeyboard" fill="#c2c2c2">
    {#if front}
        <text>front</text>
    {:else}
        <Port type="midi" x={30} y={30} isOutput={false} node={midiReceiver} label="MIDI IN" />
        <Port type="midi" x={130} y={30} isOutput={true} node={midiEmitter} label="MIDI OUT" /> 
    {/if}
</Panel>
