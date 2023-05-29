import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort, type MidiDevice } from "../types";

export class HardwareIO extends Component {
    public readonly type: string = "HardwareIO";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public readonly midiPorts: Immutable.Set<MidiPort>;

    public readonly midiDevices: Map<string, MidiDevice> = new Map();

    constructor(public readonly id: string, public readonly audioContext: AudioContext, public readonly midiAccess: MIDIAccess) {
        super(id, audioContext, midiAccess);

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.destination, componentId: id, direction: PortDirection.IN, name: "default-in" }
        ]);
        this.midiPorts = Immutable.Set([]);
        console.log();
        [
            ...midiAccess.inputs.values(),
            ...midiAccess.outputs.values()
        ].forEach(dev => this.midiDevices.set(this.getName(dev), {manufacturer: dev.manufacturer, name: dev.name}));

        [...midiAccess.inputs.values()].forEach(dev => this.midiDevices.get(this.getName(dev)).input = dev);
        [...midiAccess.outputs.values()].forEach(dev => this.midiDevices.get(this.getName(dev)).output = dev);
    }

    private getName(midiDevice: MIDIInput | MIDIOutput) : string {
        return `${midiDevice.manufacturer}_${midiDevice.name}`;
    }
}
