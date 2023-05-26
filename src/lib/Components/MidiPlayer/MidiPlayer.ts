import { bisector } from "d3";
import Immutable from "immutable";
import { read, type AnyEvent, type MidiHeader, type SetTempoEvent } from "midifile-ts";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type EventWithTime, type MidiPort } from "../types";

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
        this.tempochanges = [];

        midiFile.tracks.forEach(track => {
            let absoluteTick = 0;
            return track.forEach(event => {
                absoluteTick += event.deltaTime;
                if (event.type === 'meta' && event.subtype === 'setTempo') {
                    const lastTempoChange = this.tempochanges[search(this.tempochanges, absoluteTick)];
                    const ticksPerQuarter = this.header.ticksPerBeat;
                    const microSecondsPerQuarter = lastTempoChange?.event?.microsecondsPerBeat || 500;
                    const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                    const ticksSinceLastTempoChange = absoluteTick - (lastTempoChange?.absoluteTick || 0);
                    const deltaMs = event.deltaTime * microSecondsPerTick;
                    const result = {
                        event,
                        absoluteTick,
                        absoluteTimeMs: (lastTempoChange?.absoluteTimeMs || 0) + (ticksSinceLastTempoChange * microSecondsPerTick),
                        deltaMs
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
                const microSecondsPerQuarter = lastTempoChange?.event?.microsecondsPerBeat || 500;
                const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                const ticksSinceLastTempoChange = absoluteTick - (lastTempoChange?.absoluteTick || 0);
                const deltaMs = event.deltaTime * microSecondsPerTick;
                const result = {
                    event,
                    absoluteTick,
                    absoluteTimeMs: (lastTempoChange?.absoluteTimeMs || 0) + (ticksSinceLastTempoChange * microSecondsPerTick),
                    deltaMs
                };
                return result;
            });
        });

        console.log(this.tracks, this.tempochanges);
        this.play();
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
            const eventWithTime = trackEvents.shift();
            if (eventWithTime?.deltaMs > 0) {
                await this.wait(eventWithTime.deltaMs);
            }

            this.emit(eventWithTime.event);
        }
    }

    private async wait(ms: number) {
        return await new Promise<void>((resolve) => { setTimeout(() => resolve(), ms) })
    }

    private emit(ev: AnyEvent) {
        console.log('midiplayer dispatch', ev);
        this.midiOut.midi.dispatchEvent(new CustomEvent<AnyEvent>("midimessage", {detail: ev}));
    }
}
