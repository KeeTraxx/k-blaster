import Immutable from "immutable";
import { Component } from "../Component";
import { type Port, PortDirection } from "../types";

export class Oscillator extends Component {
    public readonly type: string = "Oscillator";
    public readonly ports: Immutable.Set<Port>;

    private readonly oscillator: OscillatorNode;

    constructor(audioContext: AudioContext, public readonly id: string) {
        super();

        this.ports = Immutable.Set<Port>([
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);

        this.oscillator = audioContext.createOscillator();

        this.oscillator.connect(this.getPort('out-0').audioNode);
    }
}