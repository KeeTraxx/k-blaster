import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort } from "../types.d";

export class HardwareIO extends Component {
    public readonly type: string = "HardwareIO";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public readonly midiPorts: Immutable.Set<MidiPort>;

    constructor(audioContext: AudioContext, public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.destination, componentId: id, direction: PortDirection.IN, name: "default-in" }
        ]);

        this.midiPorts = Immutable.Set([]);
    }
}