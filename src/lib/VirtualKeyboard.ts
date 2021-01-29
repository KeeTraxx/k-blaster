import type { DeviceConfiguration } from 'types/k-blaster';
import AbstractAudioDevice from './AbstractAudioDevice';
import MidiReceiver from './MidiReceiver';

export interface VirtualKeyboardConfiguration extends DeviceConfiguration {
}

export class VirtualKeyboard extends AbstractAudioDevice {
  constructor(audioContext:AudioContext, initialConfiguration: VirtualKeyboardConfiguration) {
    super(audioContext, initialConfiguration);
    this._midiPorts = [{
      description: 'MIDI IN',
      device: this,
      isDefault: true,
      isOutput: false,
      label: 'MIDI IN',
      node: new MidiReceiver(),
      type: 'midi',
    }, {
      description: 'MIDI OUT',
      device: this,
      isDefault: true,
      isOutput: true,
      label: 'MIDI OUT',
      node: new MidiReceiver(),
      type: 'midi',
    }];

    this._midiPorts[0].node.addEventListener('midimessage', (e) => this._midiPorts[1].node.emit('midimessage', e));
  }
}
