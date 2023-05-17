import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort } from "../types";

export class Oscillator extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "Oscillator";
    public readonly audioPorts: Immutable.Set<AudioPort>;

    private readonly oscillator: OscillatorNode;

    constructor(audioContext: AudioContext, public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);

        this.oscillator = audioContext.createOscillator();

        this.oscillator.connect(this.getAudioPort('out-0').audioNode);

        this.midiPorts = Immutable.Set([
            { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() }
        ])
    }
}