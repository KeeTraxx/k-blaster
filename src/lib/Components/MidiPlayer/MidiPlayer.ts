import { bisector } from "d3";
import Immutable from "immutable";
import { read, type AnyEvent, type MidiHeader, type SetTempoEvent, serialize } from "midifile-ts";
import { Component } from "../Component";
import { PortDirection, type AudioPort, type EventWithTime, type MidiPort } from "../types";

export class MidiPlayer extends Component {
    public readonly midiPorts: Immutable.Set<MidiPort>;
    public readonly type: string = "MidiPlayer";
    public readonly audioPorts: Immutable.Set<AudioPort>;
    private midiOutAll: MidiPort;

    private header: MidiHeader;
    private tracks: Array<EventWithTime<AnyEvent>[]>;
    private tempochanges: Array<EventWithTime<SetTempoEvent>>;

    public readonly channelPorts: Array<MidiPort>;

    constructor(public readonly id: string, public readonly audioContext: AudioContext, public readonly midiAccess: MIDIAccess) {
        super(id, audioContext, midiAccess);

        this.audioPorts = Immutable.Set<AudioPort>([]);

        this.midiOutAll = { componentId: id, direction: PortDirection.OUT, name: "out-all", midi: new EventTarget() }
        this.channelPorts = [
            { componentId: id, direction: PortDirection.OUT, name: "out-0", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-1", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-2", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-3", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-4", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-5", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-6", midi: new EventTarget() },
            { componentId: id, direction: PortDirection.OUT, name: "out-7", midi: new EventTarget() },
        ];

        this.midiPorts = Immutable.Set([this.midiOutAll, ...this.channelPorts]);

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
                    const microSecondsPerQuarter = lastTempoChange?.event?.microsecondsPerBeat || 714285;
                    const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                    const ticksSinceLastTempoChange = absoluteTick - (lastTempoChange?.absoluteTick || 0);
                    const deltaMs = event.deltaTime * microSecondsPerTick / 1000;
                    const result = {
                        event,
                        absoluteTick,
                        absoluteTimeMs: (lastTempoChange?.absoluteTimeMs || 0) + (ticksSinceLastTempoChange * microSecondsPerTick / 1000),
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
                const lastTempoChange = this.tempochanges[search(this.tempochanges, absoluteTick)] || this.tempochanges[0];
                if (!lastTempoChange) {
                    console.log(search(this.tempochanges, absoluteTick), this.tempochanges);
                    throw new Error('no last tempo');
                }
                const ticksPerQuarter = this.header.ticksPerBeat;
                const microSecondsPerQuarter = lastTempoChange?.event?.microsecondsPerBeat || 714285;
                const microSecondsPerTick = microSecondsPerQuarter / ticksPerQuarter;
                const ticksSinceLastTempoChange = absoluteTick - (lastTempoChange?.absoluteTick || 0);
                const deltaMs = event.deltaTime * microSecondsPerTick / 1000;
                const result = {
                    event,
                    absoluteTick,
                    absoluteTimeMs: (lastTempoChange?.absoluteTimeMs || 0) + (ticksSinceLastTempoChange * microSecondsPerTick / 1000),
                    deltaMs
                };
                return result;
            });
        });

        console.log(midiFile, this.tracks, this.tempochanges);
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
        const data = new Uint8Array(serialize(ev, false))
        // this.midiOut.midi.dispatchEvent(new CustomEvent<MIDIMessageEvent>("midimessage", {detail: ev}));
        this.midiOutAll.midi.dispatchEvent(new MIDIMessageEvent("midimessage", {data}));
        if (ev.type === 'channel') {
            this.channelPorts[ev.channel].midi.dispatchEvent(new MIDIMessageEvent("midimessage", {data}));
        }
    }
}
