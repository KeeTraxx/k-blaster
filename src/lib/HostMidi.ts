import type { DeviceConfiguration } from 'types/k-blaster';
import AbstractAudioDevice from './AbstractAudioDevice';
import MidiReceiver from './MidiReceiver';

export interface HostMidiConfiguration extends DeviceConfiguration {
}

export class HostMidi extends AbstractAudioDevice {
  protected _midiAccess:WebMidi.MIDIAccess | undefined = undefined;

  async boot() {
    await super.boot();
    this._midiAccess = await window.navigator.requestMIDIAccess({ sysex: true });
    this._midiAccess.addEventListener('statechange', () => this.updatePorts());
    this.updatePorts();
  }

  private updatePorts(): void {
    if (this._midiAccess?.inputs) {
      this._midiInputs = [...this._midiAccess.inputs.values()].map((d) => {
        const r = new MidiReceiver();
        d.addEventListener('midimessage', (e) => r.emit('midimessage', e));
        return r;
      });
    }

    if (this._midiAccess?.outputs) {
      this._midiOutputs = [...this._midiAccess.outputs.values()].map(() => new MidiReceiver());
    }
  }

  get configuration(): HostMidiConfiguration {
    return {
      ...super.configuration,
    };
  }
}
