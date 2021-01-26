import type { MidiReceiver } from "./MidiReceiver";

import events, { EventEmitter } from "events";

export interface DeviceConfiguration {
  type: string;
  id: string;
  params?: {[name: string]: any};
  outgoingAudioConnections?: Array<AudioConnection>;
  outgoingMidiConnections?: Array<MidiConnection>;
}

export interface AudioConnection {
  fromAudioPortIndex: number;
  toDeviceId: string;
  toAudioPortIndex: number;
}

export interface MidiConnection {
  fromMidiPortIndex: number;
  toDeviceId: string;
  toMidiPortIndex: number;
}

export interface DeviceAudioPortReference {
  device: AbstractAudioDevice;
  node: AudioNode;
}

export interface DeviceMidiPortReference {
  device: AbstractAudioDevice;
  node: MidiReceiver;
  // @ts-ignore
  listener: EventReceiver<WebMidi.MIDIMessageEvent>;
}

export class AbstractAudioDevice<INPUT extends AudioNode = AudioNode, OUTPUT extends AudioNode = AudioNode> {

  protected _audioInputs:Array<INPUT> = [];
  protected _audioOutputs:Array<OUTPUT> = [];
  protected _midiInputs:Array<MidiReceiver> = [];
  protected _midiOutputs:Array<MidiReceiver> = [];
  protected _outgoingAudioConnections:Map<OUTPUT, DeviceAudioPortReference> = new Map();
  protected _incomingAudioConnections:Map<INPUT, DeviceAudioPortReference> = new Map();
  protected _outgoingMidiConnections:Map<MidiReceiver, DeviceMidiPortReference> = new Map();
  protected _incomingMidiConnections:Map<MidiReceiver, DeviceMidiPortReference> = new Map();
  protected _analyzers:Map<AudioNode, AnalyserNode> = new Map();
  private _id:string;

  constructor(protected audioContext:AudioContext, initialConfiguration:DeviceConfiguration) {
    console.debug('Instanciating', this.constructor.name, initialConfiguration);
    this._id = initialConfiguration.id;
  }

  protected async boot():Promise<void> {
    console.debug('booting', this.constructor.name);
  }

  public static async create<T extends typeof AbstractAudioDevice>(this: T, audioContext:AudioContext, initialConfiguration: DeviceConfiguration):Promise<InstanceType<T>> {
    const instance: InstanceType<T> = new this(audioContext, initialConfiguration) as InstanceType<T>;
    await instance.boot();
    return instance;
  }

  public get id():string {
    return this._id;
  }

  public get audioInputs():Array<INPUT> {
    return this._audioInputs;
  }

  public get audioOutputs():Array<OUTPUT> {
    return this._audioOutputs;
  }

  public get midiInputs():Array<MidiReceiver> {
    return this._midiInputs;
  }

  public get midiOutputs():Array<MidiReceiver> {
    return this._midiOutputs;
  }

  public get connections() {
    return this._outgoingAudioConnections;
  }

  public connectAudioOutput(outputNode:OUTPUT, toDevice:AbstractAudioDevice, inputNode:AudioNode) {
    if (this._outgoingAudioConnections.has(outputNode)) {
      console.log('already connected.');
      return;
    }

    outputNode.connect(inputNode);
    this._outgoingAudioConnections.set(outputNode, {
      device: toDevice,
      node: inputNode
    });

    toDevice._incomingAudioConnections.set(inputNode, {
      device: this,
      node: outputNode
    });
  }

  public disconnectAudioOutput(outputNode:OUTPUT) {
    const remoteInfo = this._outgoingAudioConnections.get(outputNode);
    if (remoteInfo !== undefined) {
      outputNode.disconnect(remoteInfo.node);
      this._outgoingAudioConnections.delete(outputNode);
      remoteInfo.device._incomingAudioConnections.delete(remoteInfo.node);
    }
  }

  public disconnectAudioInput(inputNode:INPUT) {
    const remoteInfo = this._incomingAudioConnections.get(inputNode);
    if (remoteInfo !== undefined) {
      remoteInfo.device.disconnectAudioOutput(remoteInfo.node);
    }
  }

  public connectMidiOutput(outputNode:MidiReceiver, toDevice:AbstractAudioDevice, inputNode:MidiReceiver) {
    if (this._outgoingMidiConnections.has(outputNode)) {
      console.log('already connected.');
      return;
    }

    // @ts-ignore
    const listener:EventReceiver<WebMidi.MIDIMessageEvent> = (inputNode:MidiReceiver):any => (e:WebMidi.MIDIMessageEvent) => inputNode.emit('midimessage', e);
    this._outgoingMidiConnections.set(outputNode, {
      device: toDevice,
      node: inputNode,
      listener: listener(inputNode)
    });

    toDevice._incomingMidiConnections.set(inputNode, {
      device: this,
      node: outputNode,
      listener
    });
  }

  public disconnectMidiOutput(outputNode:MidiReceiver) {
    const remoteInfo = this._incomingMidiConnections.get(outputNode);
    if (remoteInfo !== undefined) {
      outputNode.removeEventListener('midimessage', remoteInfo.listener);
      this._outgoingMidiConnections.delete(outputNode);
      remoteInfo.device._incomingMidiConnections.delete(remoteInfo.node);
    }
  }

  public disconnectMidiInput(inputNode:MidiReceiver) {
    const remoteInfo = this._incomingMidiConnections.get(inputNode);
    if (remoteInfo !== undefined) {
      remoteInfo.device.disconnectMidiOutput(remoteInfo.node);
    }
  }

  public hasAudioInput():boolean {
    return this.audioInputs.length > 0;
  }

  public hasAudioOutput():boolean {
    return this.audioOutputs.length > 0;
  }

  public hasMidiInputs():boolean {
    return this._midiInputs.length > 0;
  }

  public hasMidiOutput():boolean {
    return this._midiOutputs.length > 0;
  }

  public getAnalyzer(audioNode:AudioNode):AnalyserNode {
    const analyzer = this._analyzers.get(audioNode);
    if (analyzer !== undefined) {
      return analyzer;
    } else {
      const analyzer = this.audioContext.createAnalyser();
      const FFT_SIZE = 32;
      analyzer.maxDecibels = -10;
      analyzer.minDecibels = -40;
      analyzer.fftSize = FFT_SIZE;
      audioNode.connect(analyzer);
      this._analyzers.set(audioNode, analyzer);
      return analyzer;
    }
  }

  public get configuration():DeviceConfiguration {
    return {
      type: this.constructor.name,
      id: this._id,
      outgoingAudioConnections: [...this._outgoingAudioConnections.entries()].map(([outputNode, deviceInfo]) => ({
        fromAudioPortIndex: this.audioOutputs.indexOf(outputNode),
        toDeviceId: deviceInfo.device._id,
        toAudioPortIndex: deviceInfo.device.audioInputs.indexOf(deviceInfo.node)
      })),
      outgoingMidiConnections: [...this._outgoingMidiConnections.entries()].map(([outputNode, deviceInfo]) => ({
        fromMidiPortIndex: this._midiOutputs.indexOf(outputNode),
        toDeviceId: deviceInfo.device._id,
        toMidiPortIndex: deviceInfo.device._midiInputs.indexOf(deviceInfo.node)
      }))
    }
  }
}