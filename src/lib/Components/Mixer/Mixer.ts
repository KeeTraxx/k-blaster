import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort } from "../types";

export class Mixer extends Component {
    public readonly type: string = "Mixer";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public readonly midiPorts: Immutable.Set<MidiPort>;

    constructor(audioContext: AudioContext, public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-0" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-1" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-2" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-3" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-4" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-5" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-6" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.IN, name: "in-7" },
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);

        this.midiPorts = Immutable.Set([]);

        const out0 = this.getAudioPort("out-0");

        this.audioPorts.filter(p => p.direction === PortDirection.IN).forEach(p => p.audioNode.connect(out0.audioNode));
    }
}