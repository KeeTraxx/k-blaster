import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort, type MidiDevice } from "../types";
import {disconnect} from './../../Helper/midiport';

export class HardwareIO extends Component {
    public readonly type: string = "HardwareIO";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public readonly midiPorts: Immutable.Set<MidiPort>;

    public readonly midiDevices: Map<string, MidiDevice> = new Map();

    public readonly events: EventTarget;

    constructor(public readonly id: string, public readonly audioContext: AudioContext, public readonly midiAccess: MIDIAccess) {
        super(id, audioContext, midiAccess);

        this.audioPorts = Immutable.Set<AudioPort>([
            { audioNode: audioContext.destination, componentId: id, direction: PortDirection.IN, name: "default-in" }
        ]);
        this.midiPorts = Immutable.Set([]);

        this.events = new EventTarget();

        this.updateMidiDevices();

        midiAccess.addEventListener("statechange", () => this.statechangeHandler());
    }

    private statechangeHandler() {
        this.updateMidiDevices();
        this.events.dispatchEvent(new Event("statechange"));
    }

    private updateMidiDevices() {
        [...this.midiDevices.values()].forEach(dev => {
            disconnect(dev.input)
            disconnect(dev.output)
        });
        this.midiDevices.clear();
        [
            ...this.midiAccess.inputs.values(),
            ...this.midiAccess.outputs.values()
        ].forEach(dev => this.midiDevices.set(this.getName(dev), {manufacturer: dev.manufacturer, name: dev.name}));

        [...this.midiAccess.inputs.values()].forEach(dev => this.midiDevices.get(this.getName(dev)).input = {
            componentId: this.id,
            direction: PortDirection.OUT,
            midi: dev,
            name: `${this.getName(dev)}_OUT`
        });
        [...this.midiAccess.outputs.values()].forEach(dev => this.midiDevices.get(this.getName(dev)).output = {
            componentId: this.id,
            direction: PortDirection.IN,
            midi: dev,
            name: `${this.getName(dev)}_IN`
        });
    }

    private getName(midiDevice: MIDIInput | MIDIOutput) : string {
        return `${midiDevice.manufacturer}_${midiDevice.name}`;
    }
}
