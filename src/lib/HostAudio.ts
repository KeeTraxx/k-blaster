import { AbstractAudioDevice, DeviceConfiguration } from './AbstractAudioDevice';

export interface HostAudioConfiguration extends DeviceConfiguration {

}

export class HostAudio extends AbstractAudioDevice {
  private _devices:Array<MediaDeviceInfo> = [];

  private _audioOutputMap:Map<string, MediaStreamAudioDestinationNode> = new Map();

  private _audioInputMap:Map<string, MediaStreamAudioSourceNode> = new Map();

  constructor(audioContext:AudioContext, initialConfiguration: DeviceConfiguration) {
    super(audioContext, initialConfiguration);
    navigator.mediaDevices.addEventListener('devicechange', () => this.updateDevices());
  }

  async boot() {
    await super.boot();
    await this.updateDevices();
  }

  public get devices():Array<MediaDeviceInfo> {
    return this._devices;
  }

  async getOutputDevices():Promise<Array<MediaDeviceInfo>> {
    return (await this.updateDevices()).filter((f) => f.kind === 'audiooutput');
  }

  async updateDevices():Promise<Array<MediaDeviceInfo>> {
    await navigator.mediaDevices.getUserMedia({ audio: {} });
    this._devices = await navigator.mediaDevices.enumerateDevices();

    // cleanup
    const ids = this._devices.map((d) => d.deviceId);
    [...this._audioInputMap.keys()].forEach((deviceId) => {
      if (!ids.includes(deviceId)) {
        this._audioInputMap.get(deviceId)?.disconnect();
        this._audioInputMap.delete(deviceId);
        console.debug('cleanup', deviceId);
      }
    });

    [...this._audioOutputMap.keys()].forEach((deviceId) => {
      if (!ids.includes(deviceId)) {
        this._audioOutputMap.get(deviceId)?.disconnect();
        this._audioOutputMap.delete(deviceId);
        console.debug('cleanup', deviceId);
      }
    });

    this._devices.filter((f) => f.kind === 'audiooutput').forEach((m) => {
      let node = this._audioOutputMap.get(m.deviceId);
      if (node === undefined) {
        console.debug('found new output device', m.deviceId);
        const audio = new Audio();
        node = this.audioContext.createMediaStreamDestination();
        this._audioOutputMap.set(m.deviceId, node);
        audio.srcObject = node.stream;
        audio.play();
      }
    });

    await Promise.all(this._devices.filter((f) => f.kind === 'audioinput').map(async (m) => {
      const node = this._audioInputMap.get(m.deviceId);
      if (node === undefined) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: m.deviceId } });
        const newnode = this.audioContext.createMediaStreamSource(stream);
        this._audioInputMap.set(m.deviceId, newnode);
        console.debug('found new input device', m.deviceId, newnode, this._audioInputMap.get(m.deviceId));
        return newnode;
      }
      return node;
    }));

    return this._devices;
  }

  public getAudioInputNodeById(id:string) {
    return this._audioOutputMap.get(id);
  }

  public getAudioOutputNodeById(id:string) {
    return this._audioInputMap.get(id);
  }

  get defaultAudioInputNode():AudioNode | undefined {
    const m = [...this._audioOutputMap.keys()].find((deviceId) => deviceId === 'default');
    if (m !== undefined) {
      return this._audioOutputMap.get(m);
    }
  }

  get defaultAudioOutputNode():AudioNode | undefined {
    const m = [...this._audioInputMap.keys()].find((deviceId) => deviceId === 'default');
    if (m !== undefined) {
      return this._audioInputMap.get(m);
    }
  }

  get audioOutputs():Array<AudioNode> {
    return [...this._audioInputMap.values()];
  }

  get audioInputs():Array<AudioNode> {
    return [...this._audioOutputMap.values()];
  }
}
