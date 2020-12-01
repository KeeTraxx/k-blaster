<script>
    import RackPort from "../controls/RackPort.svelte";
    import type { AudioPort, MidiNote } from "../types";
    export let audioContext: AudioContext;
    export let front: boolean;
    export const output: AudioPort<GainNode> = Object.assign(
        audioContext.createGain(),
        { isOutput: true }
    );

    const oscillators: Array<
        { osc: OscillatorNode; gain: GainNode } | undefined
    > = [];

    function play(note: MidiNote) {
        if (oscillators[note.pitch] !== undefined) {
            stop(note);
        }
        const oscDevice = (oscillators[note.pitch] = {
            osc: audioContext.createOscillator(),
            gain: audioContext.createGain(),
        });
        // https://en.wikipedia.org/wiki/MIDI_tuning_standard
        oscDevice.osc.frequency.value =
            Math.pow(2, (note.pitch - 69) / 12) * 440;
        oscDevice.osc.connect(oscDevice.gain);
        oscDevice.gain.connect(output);
        oscDevice.osc.start();
        console.log("start", note);
    }

    function stop(note: MidiNote) {
        console.log("stop", note);
        const osc = oscillators[note.pitch];
        osc?.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        oscillators[note.pitch] = undefined;
    }
</script>

{#if front}
    <g>
        <rect
            width="960"
            height="100"
            fill="#bbb"
            on:mousedown={(e) => play({ channel: 1, pitch: 67, velocity: 127 })}
            on:mouseup={(e) => stop({
                    channel: 1,
                    pitch: 67,
                    velocity: 127,
                })} />
        <text x="20" y="20">Oscillator</text>
    </g>
{:else}
    <g>
        <rect
            width="960"
            height="100"
            fill="#bbb" />
        <g transform="translate(20,20)">
            <RackPort audioPort={output} />
        </g>
    </g>
{/if}
