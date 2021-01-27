import type { AbstractAudioDevice } from '../src/lib/AbstractAudioDevice';
import type { MidiReceiver } from '../src/lib/MidiReceiver';

export interface AudioConnection {
  fromAudioPortIndex: number;
  toDeviceId: string;
  toAudioPortIndex: number;
}

export interface MidiConnection {
  fromMidiPortIndex: number;
  toDeviceId: string;
  toMidiPortIndex: number;
}

export interface DeviceConfiguration {
  type: string;
  id: string;
  params?: {[name: string]: any};
  outgoingAudioConnections?: Array<AudioConnection>;
  outgoingMidiConnections?: Array<MidiConnection>;
}

export interface DeviceAudioPortReference {
  device: AbstractAudioDevice;
  node: AudioNode;
}

export interface DeviceMidiPortReference {
  device: AbstractAudioDevice;
  node: MidiReceiver;
  // @ts-ignore
  listener: EventReceiver<WebMidi.MIDIMessageEvent>;
}
