import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort } from "../types";
import { get, writable } from "svelte/store";
import type { AnyEvent } from "midifile-ts";

export class Oscillator extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "Oscillator";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public ppq = writable(480);
    public waveForm = writable<OscillatorType>("sine");

    constructor(private audioContext: AudioContext, public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);

        const midiIn = { componentId: id, direction: PortDirection.IN, name: "in-0", midi: new EventTarget() }

        midiIn.midi.addEventListener("midimessage", this.playMidi);

        this.midiPorts = Immutable.Set([
            midiIn
        ]);

        midiIn.midi.addEventListener("midimessage", (ev:CustomEvent<AnyEvent>) => this.onMidiMessage(ev.detail))
    }
    private onMidiMessage(midiMessage: AnyEvent) {
        console.log('osc got midi', midiMessage);
    }

    public play(frequency: number = 440, seconds: number = 1) {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = get(this.waveForm);
        oscillator.connect(this.getAudioPort('out-0').audioNode);
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + seconds);
    }

    public playMidi(midiMessage: MIDIMessageEvent) {
        console.log('Oscillator wanna play', midiMessage);
    }
}