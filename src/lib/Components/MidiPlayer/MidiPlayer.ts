import Immutable from "immutable";
import { writable } from "svelte/store";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type MidiPort } from "../types.d";
import { read } from "midifile-ts";

export class MidiPlayer extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "MidiPlayer";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    public ppq = writable(480);

    private midiOut: MidiPort;

    constructor(public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([]);

        this.midiOut = { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() }

        this.midiPorts = Immutable.Set([
            this.midiOut
        ]);
    }

    public load(buffer: ArrayBuffer) {
        const mididata = read(buffer);
        console.log(mididata);
    }

    public play() {
    }
}