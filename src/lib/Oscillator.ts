import { MidiEvent, MIDI_COMMANDS, parseMidiEvent } from "../Util";
import { AbstractAudioDevice, DeviceConfiguration } from "./AbstractAudioDevice";
import { MidiReceiver } from "./MidiReceiver";

export interface OscillatorConfiguration extends DeviceConfiguration {
  numFourierCoefficients:number;
  oscillatorType: OscillatorType
}

const defaults:OscillatorConfiguration = {
  id: '',
  type: '',
  numFourierCoefficients: 10,
  oscillatorType: 'sine'
}

interface MiniOscillator {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
}

export class Oscillator extends AbstractAudioDevice {

  protected numFourierCoefficients:number;
  public oscillatorType: OscillatorType;
  protected oscillatorMap:Map<number, MiniOscillator> = new Map();

  constructor(audioContext:AudioContext, initialConfiguration: OscillatorConfiguration) {
    super(audioContext, initialConfiguration);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.2;
    this._audioOutputs = [gainNode];
    this._midiInputs = [new MidiReceiver()];

    const config = {
      ...defaults,
      ...initialConfiguration
    };

    this.numFourierCoefficients = config.numFourierCoefficients;
    this.oscillatorType = config.oscillatorType;

    this._midiInputs[0].addEventListener('midimessage', this.midiMessage);
  }

  protected midiMessage(e:WebMidi.MIDIMessageEvent) {
    const midiEvent = parseMidiEvent(e);

    switch(midiEvent.command) {
      case MIDI_COMMANDS.noteon:
        this.play(this.freq(midiEvent));
        break;
      case MIDI_COMMANDS.noteoff:
        this.stop(this.freq(midiEvent));
        break;
      default:
        console.error('Unknown MIDI Command', midiEvent);
        break;
    }
  }

  private freq(midiEvent:MidiEvent): number {
    if (midiEvent.data1) {
      return Math.pow(2, (midiEvent.data1 - 69) / 12) * 440;
    } else {
      throw new Error('No MIDI data1');
    }
  }

  public play(freq:number = Math.pow(2, (60 - 69) / 12) * 440, velocity:number = 1) {
    this.stop(freq);

    const o:MiniOscillator = {
      oscillatorNode: this.audioContext.createOscillator(),
      gainNode: this.audioContext.createGain()
    }

    o.gainNode.gain.value = velocity;

    o.oscillatorNode.connect(o.gainNode).connect(this.audioOutputs[0]);
    o.oscillatorNode.start();
    this.oscillatorMap.set(freq, o);
  }

  public stop(freq:number = Math.pow(2, (60 - 69) / 12) * 440) {
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
      oscillatorType: this.oscillatorType
    }
  }
}