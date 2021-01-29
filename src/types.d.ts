import type AbstractAudioDevice from './lib/AbstractAudioDevice';
import type MidiReceiver from './lib/MidiReceiver';

export interface MidiNote {
  pitch: number;
  velocity: number;
  channel: number;
}

export interface Port {
  device: AbstractAudioDevice;
  type: string;
  isOutput: boolean;
  node: any;
  connectedTo?: Port;
}

export interface GenericPort<D extends AbstractAudioDevice = AbstractAudioDevice> {
  connection?: GenericPort;
  device: D;
  type: 'midi' | 'audio';
  isOutput: boolean;
  description: string;
  label: string;
  element?: SVGGraphicsElement;
  isDefault: boolean;
}

export interface AudioPort<D extends AbstractAudioDevice = AbstractAudioDevice, T extends AudioNode = AudioNode> extends GenericPort<D> {
  node: T;
  connection?: AudioPort;
}

export interface MidiPort<D extends AbstractAudioDevice = AbstractAudioDevice> extends GenericPort<D> {
  node: MidiReceiver;
  connection?: MidiPort
  listener?: (e) => void;
}
