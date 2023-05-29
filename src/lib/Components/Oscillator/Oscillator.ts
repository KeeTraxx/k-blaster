import Immutable from "immutable";
import { Stream, deserializeSingleEvent } from "midifile-ts";
import { get, writable } from "svelte/store";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type MidiPort } from "../types";

export class Oscillator extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "Oscillator";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public waveForm = writable<OscillatorType>("sine");
    private oscillators = new Map<number, OscillatorNode>();

    constructor(private audioContext: AudioContext, public readonly id: string) {
        super(id);

        const audioNode = audioContext.createGain();
        audioNode.gain.setValueAtTime(0.2, 0);
        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode, componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);

        this.midiPorts = Immutable.Set([
            { componentId: id, direction: PortDirection.IN, name: "in-0", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-1", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-2", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-3", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-4", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-5", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-6", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.IN, name: "in-7", midi: new EventTarget() },
        ]);

        [...this.midiPorts].forEach(p => p.midi.addEventListener("midimessage", (ev: MIDIMessageEvent) => this.playMidi(ev)));
    }

    public playMidi(midiMessage: MIDIMessageEvent) {
        const message = deserializeSingleEvent(new Stream(midiMessage.data));
        switch (message.type) {
            case "channel":
                switch (message.subtype) {
                    case "noteOff":
                        this.oscillators.get(message.noteNumber)?.stop();
                        break;
                    case "noteOn":
                        this.oscillators.get(message.noteNumber)?.stop();
                        const oscillator = this.audioContext.createOscillator();
                        this.oscillators.set(message.noteNumber, oscillator);
                        oscillator.type = get(this.waveForm);
                        oscillator.connect(this.getAudioPort('out-0').audioNode);
                        const frequency = this.midiNoteToFreq(message.noteNumber);
                        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + 10);
                        break;
                    case "unknown":
                    case "noteAftertouch":
                    case "programChange":
                    case "channelAftertouch":
                    case "pitchBend":
                    case "controller":
                        console.warn('unsupported event', message);
                        break;
                }
                break;
            case "meta":
            case "sysEx":
            case "dividedSysEx":
            default:
                console.warn('unsupported event', message);
                break;
        }

    }

    private midiNoteToFreq(midiNote: number): number {
        const a = 440;
        return a / 32 * (Math.pow(2, (midiNote - 9) / 12));
    }
}