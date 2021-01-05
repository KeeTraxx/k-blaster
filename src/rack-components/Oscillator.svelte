<script>
    import { MidiReceiver } from "../lib/MidiReceiver";

    import Port from "../controls/Port.svelte";

    import { MIDI_COMMANDS, parseMidiEvent } from "../Util";
    import type { MidiEvent } from "../Util";
    import Panel from "../controls/Panel.svelte";
    import DigitalSelector from "../controls/DigitalSelector.svelte";
    import SvgButton from "../controls/SvgButton.svelte";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const output: GainNode = audioContext.createGain();
    let oscillatorType: OscillatorType = "sine";
    const input: MidiReceiver = new MidiReceiver();

    input.on("midimessage", (ev) => {
        const e = parseMidiEvent(ev);
        switch (e.command) {
            case MIDI_COMMANDS.noteon:
                play(e);
                break;
            case MIDI_COMMANDS.noteoff:
                stop(e);
                break;
            default:
                console.trace("Unknown midi command", e.command);
        }
    });

    const oscillators: Array<
        { osc: OscillatorNode; gain: GainNode } | undefined
    > = [];

    function play(note: MidiEvent) {
        if (oscillators[note.data1] !== undefined) {
            stop(note);
        }
        const oscDevice = (oscillators[note.data1] = {
            osc: audioContext.createOscillator(),
            gain: audioContext.createGain(),
        });
        oscDevice.gain.gain.value = 1;
        oscDevice.osc.type = oscillatorType;
        // https://en.wikipedia.org/wiki/MIDI_tuning_standard
        oscDevice.osc.frequency.value =
            Math.pow(2, (note.data1 - 69) / 12) * 440;
        oscDevice.osc.connect(oscDevice.gain);
        oscDevice.gain.connect(output);
        oscDevice.osc.start();
        console.log("start", note);
    }

    function stop(note: MidiEvent) {
        console.log("stop", note);
        const osc = oscillators[note.data1];
        osc?.gain.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + 0.1
        );
        oscillators[note.data1] = undefined;
    }

    async function playNote(midiNote: number, millis: number) {
        play({
            channel: 0,
            data1: midiNote,
            timestamp: 0,
            command: MIDI_COMMANDS.noteon,
            data2: 100,
        });
        await new Promise((resolve) => setTimeout(resolve, millis));
        stop({
            channel: 0,
            data1: midiNote,
            timestamp: 0,
            command: MIDI_COMMANDS.noteon,
            data2: 50,
        });
    }

    async function testSoundStart() {
        for (let i = 0; i < 8; i++) {
            await playNote(60+i, 300);
        }
    }
</script>

<Panel type="Oscillator" width={960} height={100} fill="#dbb">
    {#if front}
        <DigitalSelector
            on:select={(v) => (oscillatorType = v.detail.value)}
            x={20}
            y={20}
            items={['sine', 'square', 'triangle'].map((label) => ({
                label,
                value: label,
            }))} />
        <SvgButton
            text="SoundTest"
            on:click={(e) => testSoundStart()}
            x={250}
            y={20} />
    {:else}
        <g transform="translate(20,20)">
            <Port
                node={output}
                isOutput={true}
                type="audio"
                label="Audio out" />
            <Port
                x={200}
                node={input}
                isOutput={false}
                type="midi"
                label="MIDI in" />
        </g>
    {/if}
</Panel>
