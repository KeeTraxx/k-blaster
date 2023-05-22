import Immutable from "immutable";
import { writable } from "svelte/store";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type MidiPort, type EventWithTime } from "../types";
import { read, type MidiFile, type AnyEvent, type MidiHeader, type SetTempoEvent } from "midifile-ts";
import { bisector, type Bisector } from "d3";

export class MidiPlayer extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "MidiPlayer";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    private midiOut: MidiPort;

    private header: MidiHeader;
    private tracks: Array<EventWithTime<AnyEvent>[]>;
    private tempochanges: Array<EventWithTime<SetTempoEvent>>;

    constructor(public readonly id: string) {
        super();

        this.audioPorts = Immutable.Set<AudioPort>([]);

        this.midiOut = { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() }

        this.midiPorts = Immutable.Set([
            this.midiOut
        ]);
    }

    public load(buffer: ArrayBuffer) {
        const midiFile = read(buffer);
        this.header = midiFile.header;
        const search = bisector<EventWithTime<SetTempoEvent>, number>(d => d.absoluteTick).left;

        midiFile.tracks.forEach(track => {
            let absoluteTick = 0;
            return track.forEach(event => {
                absoluteTick += event.deltaTime;
                if (event.type === 'meta' && event.subtype === 'setTempo') {
                    const lastTempoChange = this.tempochanges[search(this.tempochanges, absoluteTick)];
                    const ticksPerQuarter = this.header.ticksPerBeat;
                    const microSecondsPerQuarter = lastTempoChange.event.microsecondsPerBeat;
                    const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                    const ticksSinceLastTempoChange = absoluteTick - lastTempoChange.absoluteTick;
                    const result = {
                        event,
                        absoluteTick,
                        absoluteTimeMs: lastTempoChange.absoluteTimeMs + (ticksSinceLastTempoChange * microSecondsPerTick)
                    };
                    this.tempochanges.push(result as EventWithTime<SetTempoEvent>);
                }
            })
        });

        this.tracks = midiFile.tracks.map(track => {
            let absoluteTick = 0;
            return track.map(event => {
                absoluteTick += event.deltaTime;
                const lastTempoChange = this.tempochanges[search(this.tempochanges, absoluteTick)];
                const ticksPerQuarter = this.header.ticksPerBeat;
                const microSecondsPerQuarter = lastTempoChange.event.microsecondsPerBeat;
                const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                const ticksSinceLastTempoChange = absoluteTick - lastTempoChange.absoluteTick;
                const result = {
                    event,
                    absoluteTick,
                    absoluteTimeMs: lastTempoChange.absoluteTimeMs + (ticksSinceLastTempoChange * microSecondsPerTick)
                };
                return result;
            });
        });

        console.log(this.tracks, this.tempochanges);
    }

    public play() {
        if (!this.header) {
            throw new Error("No MIDI File loaded.");
        }

        this.tracks.forEach(trackEvents => {
            this.playTrack(trackEvents);
        });
    }

    private async playTrack(trackEvents: Array<EventWithTime<AnyEvent>>) {
        while (trackEvents.length > 0) {
            const event = trackEvents.shift();
            //if (event.deltaTime > 0) {
            //    await this.wait(event.deltaTime);
            //}

            this.emit(event.event);
        }
    }

    private async wait(ms: number) {
        return await new Promise((resolve) => { setTimeout(() => resolve(undefined), ms) })
    }

    private emit(ev: AnyEvent) {

    }
}
