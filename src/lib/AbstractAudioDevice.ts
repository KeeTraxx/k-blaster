import type { AudioPort, MidiPort } from 'src/types';
import type { DeviceConfiguration } from 'types/k-blaster';
import log from '../helper/Logger';

export default class AbstractAudioDevice {
  protected _audioPorts:Array<AudioPort<this>> = [];

  protected _midiPorts:Array<MidiPort> = [];

  protected _analyzers:Map<AudioNode, AnalyserNode> = new Map();

  private _id:string;

  constructor(protected audioContext:AudioContext, initialConfiguration:DeviceConfiguration) {
    log.debug('Instanciating', this.constructor.name, initialConfiguration);
    this._id = initialConfiguration.id;
  }

  protected async boot():Promise<void> {
    log.debug('booting', this.constructor.name);
  }

  public static async create<T extends typeof AbstractAudioDevice>(
    this: T,
    audioContext:AudioContext,
    initialConfiguration: DeviceConfiguration,
  ):Promise<InstanceType<T>> {
    const instance: InstanceType<T> = new this(audioContext, initialConfiguration) as InstanceType<T>;
    await instance.boot();
    return instance;
  }

  public get id():string {
    return this._id;
  }

  public get audioPorts():Array<AudioPort<this>> {
    return this._audioPorts;
  }

  public get midiPorts():Array<MidiPort> {
    return this._midiPorts;
  }

  public getAnalyzer(audioPort:AudioPort<this>):AnalyserNode {
    const analyzer = this._analyzers.get(audioPort.node);
    if (analyzer !== undefined) {
      return analyzer;
    }
    const analyzerNode = this.audioContext.createAnalyser();
    const FFT_SIZE = 32;
    analyzerNode.maxDecibels = -10;
    analyzerNode.minDecibels = -40;
    analyzerNode.fftSize = FFT_SIZE;
    audioPort.node.connect(analyzerNode);
    this._analyzers.set(audioPort.node, analyzerNode);
    audioPort.node.connect(analyzerNode);
    return analyzerNode;
  }

  public get configuration():DeviceConfiguration {
    throw new Error(`${this.constructor} configuration not implemented yet...`);
  }
}
