import {range} from 'd3';

import { AbstractAudioDevice, DeviceConfiguration } from "./AbstractAudioDevice";

export interface MixerConfiguration extends DeviceConfiguration {
  numInputs: number;
  numOutputs: number;
}

export class Mixer extends AbstractAudioDevice {

  constructor(audioContext:AudioContext, initialConfiguration: MixerConfiguration) {
    super(audioContext, initialConfiguration);
    this._audioInputs = range(initialConfiguration.numInputs).map(() => audioContext.createGain());
    this._audioOutputs = range(initialConfiguration.numOutputs).map(() => audioContext.createGain());
    this._audioInputs.forEach(inputNode => this.audioOutputs.forEach(outputNode => inputNode.connect(outputNode)));
  }

  get configuration(): MixerConfiguration {
    return {
      ...super.configuration,
      numInputs: this._audioInputs.length,
      numOutputs: this._audioOutputs.length
    }
  }
}