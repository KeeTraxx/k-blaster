import type { DeviceConfiguration } from 'types/k-blaster';
import log from '../helper/Logger';
import { MidiEvent, MidiCommands, parseMidiEvent } from '../Util';
import AbstractAudioDevice from './AbstractAudioDevice';
import MidiReceiver from './MidiReceiver';

export interface OscillatorConfiguration extends DeviceConfiguration {
  numFourierCoefficients:number;
  oscillatorType: OscillatorType
}

const defaults:OscillatorConfiguration = {
  id: '',
  type: '',
  numFourierCoefficients: 10,
  oscillatorType: 'sine',
};

interface MiniOscillator {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
}

export class Oscillator extends AbstractAudioDevice {
  protected numFourierCoefficients:number;

  public oscillatorType: OscillatorType;

  public customCosCoeffs: Float32Array = Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  public customSinCoeffs: Float32Array = Float32Array.from([0, 1, 0, 0.33, 0, 0.25, 0, 0.14, 0, 0.11]);

  protected oscillatorMap:Map<number, MiniOscillator> = new Map();

  constructor(audioContext:AudioContext, initialConfiguration: OscillatorConfiguration) {
    super(audioContext, initialConfiguration);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.2;

    const config = {
      ...defaults,
      ...initialConfiguration,
    };

    this.numFourierCoefficients = config.numFourierCoefficients;
    this.oscillatorType = config.oscillatorType;
    this._audioPorts = [{
      description: 'Oscillator Output',
      label: 'Output',
      device: this,
      isOutput: true,
      node: audioContext.createGain(),
      type: 'audio',
      isDefault: true,
    }];

    const node = new MidiReceiver();
    node.addEventListener('midimessage', (e) => this.midiMessage(e));

    this._midiPorts = [{
      description: 'MIDI IN',
      label: 'IN',
      device: this,
      isOutput: false,
      node,
      type: 'midi',
      isDefault: true,
    }];
  }

  protected midiMessage(e:WebMidi.MIDIMessageEvent) {
    const midiEvent = parseMidiEvent(e);

    switch (midiEvent.command) {
      case MidiCommands.noteon:
        this.play(Oscillator.midiEvent2Freq(midiEvent));
        break;
      case MidiCommands.noteoff:
        this.stop(Oscillator.midiEvent2Freq(midiEvent));
        break;
      default:
        log.error('Unknown MIDI Command', midiEvent);
        break;
    }
  }

  private static midiEvent2Freq(midiEvent:MidiEvent): number {
    if (midiEvent.data1) {
      return (2 ** ((midiEvent.data1 - 69) / 12)) * 440;
    }
    throw new Error('No MIDI data1');
  }

  public play(freq:number = (2 ** ((60 - 69) / 12)) * 440, velocity:number = 1) {
    this.stop(freq);

    const o:MiniOscillator = {
      oscillatorNode: this.audioContext.createOscillator(),
      gainNode: this.audioContext.createGain(),
    };

    o.gainNode.gain.value = velocity;
    o.oscillatorNode.frequency.value = freq;
    if (this.oscillatorType === 'custom') {
      const wave = this.audioContext.createPeriodicWave(this.customCosCoeffs, this.customSinCoeffs);
      o.oscillatorNode.setPeriodicWave(wave);
    } else {
      o.oscillatorNode.type = this.oscillatorType;
    }

    o.oscillatorNode.connect(o.gainNode).connect(this._audioPorts[0].node);
    o.oscillatorNode.start();
    this.oscillatorMap.set(freq, o);
  }

  public stop(freq:number = (2 ** ((60 - 69) / 12)) * 440) {
    const oldOscillator = this.oscillatorMap.get(freq);
    if (oldOscillator) {
      oldOscillator.oscillatorNode.stop();
      oldOscillator.oscillatorNode.disconnect();
      oldOscillator.gainNode.disconnect();
      this.oscillatorMap.delete(freq);
    }
  }

  get configuration(): OscillatorConfiguration {
    return {
      ...super.configuration,
      numFourierCoefficients: this.numFourierCoefficients,
      oscillatorType: this.oscillatorType,
    };
  }
}
