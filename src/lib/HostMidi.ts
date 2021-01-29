import type { MidiPort } from 'src/types';
import type { DeviceConfiguration } from 'types/k-blaster';
import log from '../helper/Logger';
import AbstractAudioDevice from './AbstractAudioDevice';
import MidiReceiver from './MidiReceiver';

export interface HostMidiConfiguration extends DeviceConfiguration {
}

export class HostMidi extends AbstractAudioDevice {
  protected _midiAccess:WebMidi.MIDIAccess | undefined = undefined;

  async boot() {
    await super.boot();
    this._midiAccess = await window.navigator.requestMIDIAccess({ sysex: true });
    // this._midiAccess.addEventListener('statechange', () => this.updatePorts());
    this.updatePorts();
  }

  private updatePorts(): void {
    log.warn('update ports.');
    const ports:Array<MidiPort<this>> = [];
    if (this._midiAccess?.inputs) {
      ports.push(...[...this._midiAccess.inputs.values()].map((d) => {
        log.debug('Found MIDI INPUT device', d);
        const node = new MidiReceiver();
        d.addEventListener('midimessage', (e) => node.emit('midimessage', e));
        // node.addEventListener('midimessage', (e) => console.log('from node', e));
        // d.addEventListener('midimessage', (e) => console.warn(d, e));

        const port:MidiPort<this> = {
          // label: d.name || 'n/a',
          label: `SUPER ${d.name}`,
          description: d.manufacturer || 'n/a',
          device: this,
          node,
          type: 'midi',
          isOutput: true,
          isDefault: false,
        };

        return port;
      }));
    }

    if (this._midiAccess?.outputs) {
      ports.push(...[...this._midiAccess.outputs.values()].map((d) => {
        log.debug('Found MIDI OUTPUT device', d);
        const port:MidiPort<this> = {
          label: d.name || 'n/a',
          description: d.manufacturer || 'n/a',
          device: this,
          // @ts-ignore TODO shrink down MidiReceiver
          node: d,
          type: 'midi',
          isOutput: false,
          isDefault: false,
        };

        return port;
      }));
    }

    log.debug(ports);
    this._midiPorts = ports;
  }
}
