import Immutable from "immutable";
import { writable } from "svelte/store";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type MidiPort } from "../types.d";
import { read, type MidiFile, type AnyEvent } from "midifile-ts";

export class MidiPlayer extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "MidiPlayer";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    private midiOut: MidiPort;

    private midiFile: MidiFile;

    constructor(public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([]);

        this.midiOut = { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() }

        this.midiPorts = Immutable.Set([
            this.midiOut
        ]);
    }

    public load(buffer: ArrayBuffer) {
        this.midiFile = read(buffer);
    }

    public play() {
        if (!this.midiFile) {
            throw new Error("No MIDI File loaded.");
        }

        this.midiFile.tracks.forEach(trackEvents => {
            this.playTrack(trackEvents);
        });
    }

    private async playTrack(trackEvents: Array<AnyEvent>) {
        while (trackEvents.length > 0) {
            const event = trackEvents.shift();
            if (event.deltaTime > 0) {
                await this.wait(event.deltaTime);
            }

            this.emit(event);
        }
    }

    private async wait(ms: number) {
        return await new Promise((resolve) => { setTimeout(() => resolve(undefined), ms) })
    }

    private emit(ev: AnyEvent) {

    }
}
