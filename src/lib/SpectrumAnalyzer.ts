import type { AudioPort } from 'src/types';
import type { DeviceConfiguration } from 'types/k-blaster';
import AbstractAudioDevice from './AbstractAudioDevice';

export interface SpectrumAnalyzerConfiguration extends DeviceConfiguration {
}

export class SpectrumAnalyzer extends AbstractAudioDevice {
  private _analyzer: AnalyserNode;

  constructor(audioContext:AudioContext, initialConfiguration: SpectrumAnalyzerConfiguration) {
    super(audioContext, initialConfiguration);
    const node = audioContext.createGain();
    const audioInput:AudioPort<this> = {
      description: 'input',
      label: 'input',
      device: this,
      node,
      type: 'audio',
      isOutput: false,
      isDefault: false,
    };

    const audioOutput:AudioPort<this> = {
      description: 'output',
      label: 'output',
      device: this,
      node,
      type: 'audio',
      isOutput: true,
      isDefault: false,
    };

    this._audioPorts = [audioInput, audioOutput];
    this._analyzer = audioContext.createAnalyser();
    audioInput.node.connect(this._analyzer);
    this._analyzer.maxDecibels = -30;
    this._analyzer.minDecibels = -80;
    this._analyzer.fftSize = 1024;
  }

  get analyzer():AnalyserNode {
    return this._analyzer;
  }
}
