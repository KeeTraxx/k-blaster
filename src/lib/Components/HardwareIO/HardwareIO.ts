import Immutable from "immutable";
import { Component } from "../Component";
import { type AudioPort, PortDirection, type MidiPort, type MidiDevice } from "../types";
import { disconnect } from './../../Helper/midiport';

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
        console.log('update midi devices');
        
        const newDeviceNames = [
            ...this.midiAccess.inputs.values(),
            ...this.midiAccess.outputs.values()
        ].map(dev => this.getName(dev));
        
        [...this.midiDevices.values()].forEach(midiDevice => {
            const name = this.getName(midiDevice);
            console.log('checking ', name, newDeviceNames);
            if (!newDeviceNames.includes(name)) {
                // remove disconnected devices
                console.log(`${name} has disconnected`);
                disconnect(midiDevice.input)
                disconnect(midiDevice.output)
                this.midiDevices.delete(name);
            }
        });
        

        // add new devices
        [
            ...this.midiAccess.inputs.values(),
            ...this.midiAccess.outputs.values()
        ].forEach(dev => {
            const name = this.getName(dev);
            if (!this.midiDevices.has(name))
                this.midiDevices.set(name, { manufacturer: dev.manufacturer, name: dev.name });
        });

        [...this.midiAccess.inputs.values()].forEach(dev => {
            const midiDevice = this.midiDevices.get(this.getName(dev));
            if (!midiDevice.input) {
                midiDevice.input = {
                    componentId: this.id,
                    direction: PortDirection.OUT,
                    midi: dev,
                    name: `${this.getName(dev)}_OUT`
                };
            }
        });

        [...this.midiAccess.outputs.values()].forEach(dev => {
            const midiDevice = this.midiDevices.get(this.getName(dev));
            if (!midiDevice.output) {
                midiDevice.output = {
                    componentId: this.id,
                    direction: PortDirection.IN,
                    midi: dev,
                    name: `${this.getName(dev)}_IN`
                };
            }
        });
    }

    private getName(midiDevice: MIDIInput | MIDIOutput | MidiDevice): string {
        return `${midiDevice.manufacturer}_${midiDevice.name}`;
    }
}
