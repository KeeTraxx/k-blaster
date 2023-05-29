import type { AudioPort, MidiPort } from "./types";

export abstract class Component {
    constructor(public readonly id: string) {

    }

    public getAudioPort(name: string): AudioPort {
        const port = [...this.audioPorts].find(p => p.name === name);
        if (port) {
            return port;
        }

        throw new Error(`AudioPort ${name} not found in component ${this.id}`);
    }

    public getMidiPort(name: string): MidiPort {
        const port = [...this.midiPorts].find(p => p.name === name);
        if (port) {
            return port;
        }

        throw new Error(`MidiPort ${name} not found`);
    }

    public abstract readonly audioPorts : Immutable.Set<AudioPort>;
    public abstract readonly midiPorts : Immutable.Set<MidiPort>;
    public abstract readonly type : string;
}