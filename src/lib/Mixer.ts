import { range } from 'd3';
import type { AudioPort } from 'src/types';
import type { DeviceConfiguration } from 'types/k-blaster';
import AbstractAudioDevice from './AbstractAudioDevice';

export interface MixerConfiguration extends DeviceConfiguration {
  numInputs: number;
  numOutputs: number;
}

export class Mixer extends AbstractAudioDevice {
  constructor(audioContext:AudioContext, initialConfiguration: MixerConfiguration) {
    super(audioContext, initialConfiguration);
    const audioInputs:Array<AudioPort<this>> = range(initialConfiguration.numInputs).map((_, i) => ({
      description: `input-${i}`,
      label: `input-${i}`,
      device: this,
      node: audioContext.createGain(),
      type: 'audio',
      isOutput: false,
      isDefault: false,
    }));
    const audioOutputs:Array<AudioPort<this>> = range(initialConfiguration.numOutputs).map((_, i) => ({
      description: `output-${i}`,
      label: `output-${i}`,
      device: this,
      node: audioContext.createGain(),
      type: 'audio',
      isOutput: true,
      isDefault: false,
    }));
    audioInputs.forEach((inputPort) => audioOutputs.forEach((outputPort) => inputPort.node.connect(outputPort.node)));

    this._audioPorts = [...audioInputs, ...audioOutputs];
  }

  public get masterOutput():AudioPort<this, GainNode> {
    const port = this._audioPorts.find((p) => p.isOutput);
    if (port === undefined) {
      throw new Error('No masterOutput found');
    }

    return port as AudioPort<this, GainNode>;
  }

  public get audioPorts():Array<AudioPort<this, GainNode>> {
    return this._audioPorts as Array<AudioPort<this, GainNode>>;
  }
}
