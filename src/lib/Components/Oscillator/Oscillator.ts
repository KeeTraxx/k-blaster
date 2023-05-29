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
    private oscillators = new Map<number, OscillatorAndGainNode>();

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
                        this.oscillators.get(message.noteNumber)?.oscillatorNode.stop();
                        this.stop(this.oscillators.get(message.noteNumber));
                        break;
                    case "noteOn":
                        this.stop(this.oscillators.get(message.noteNumber));

                        const oscillatorNode = this.audioContext.createOscillator();
                        const gainNode = this.audioContext.createGain();
                        oscillatorNode.connect(gainNode);
                        this.oscillators.set(message.noteNumber, {oscillatorNode, gainNode});
                        oscillatorNode.type = get(this.waveForm);
                        gainNode.connect(this.getAudioPort('out-0').audioNode);
                        // gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                        // gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
                        const frequency = this.midiNoteToFreq(message.noteNumber);
                        oscillatorNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                        oscillatorNode.start();
                        oscillatorNode.stop(this.audioContext.currentTime + 10);
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
    stop(og: OscillatorAndGainNode) {
        if (!og) {
            return;
        }
        const {oscillatorNode, gainNode} = og;
        if (!oscillatorNode || !gainNode)  {
            return;
        }

        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.01);
        oscillatorNode.stop(this.audioContext.currentTime + 0.5);
        oscillatorNode.addEventListener("ended", () => {
            gainNode.disconnect();
            oscillatorNode.disconnect();
        });
    }

    private midiNoteToFreq(midiNote: number): number {
        const a = 440;
        return a / 32 * (Math.pow(2, (midiNote - 9) / 12));
    }
}

interface OscillatorAndGainNode {
    oscillatorNode: OscillatorNode;
    gainNode: GainNode;
}