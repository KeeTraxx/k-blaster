import Immutable from "immutable";
import { Component } from "../Component";
import { type Port, PortDirection } from "../types.d";

export class Mixer extends Component {
    public readonly type: string = "Mixer";
    public readonly ports: Immutable.Set<Port>;

    constructor(audioContext: AudioContext, public readonly id: string) {
        super();

        this.ports = Immutable.Set<Port>([
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

        const out0 = this.getPort("out-0");

        this.ports.filter(p => p.direction === PortDirection.IN).forEach(p => p.audioNode.connect(out0.audioNode));
    }
}