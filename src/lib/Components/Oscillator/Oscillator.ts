import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort } from "../types.d";

export class Oscillator extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "Oscillator";
    public readonly audioPorts: Immutable.Set<AudioPort>;


    constructor(private audioContext: AudioContext, public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.createGain(), componentId: id, direction: PortDirection.OUT, name: "out-0" }
        ]);


        this.midiPorts = Immutable.Set([
            { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() }
        ]);
    }

    public test() {
        
        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(this.getAudioPort('out-0').audioNode);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2);
    }
}