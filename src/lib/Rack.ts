import log from '../helper/Logger';
import type AbstractAudioDevice from './AbstractAudioDevice';
import { HostAudio, HostAudioConfiguration } from './HostAudio';
import { HostMidi, HostMidiConfiguration } from './HostMidi';
import { Mixer, MixerConfiguration } from './Mixer';
import { Oscillator, OscillatorConfiguration } from './Oscillator';
import { connect } from './PortUtil';

const constructorMap:Map<string, Object> = new Map();
constructorMap.set('HostAudio', HostAudio);
constructorMap.set('Mixer', Mixer);
constructorMap.set('Oscillator', Oscillator);
constructorMap.set('HostMidi', HostMidi);

type AllConfigurations =
 | HostAudioConfiguration
 | MixerConfiguration
 | OscillatorConfiguration
 | HostMidiConfiguration;

export default class Rack {
  private _devices:Array<AbstractAudioDevice> = [];

  constructor(private audioContext:AudioContext) {
    // TODO validation of config

  }

  public async loadConfig(configuration:Array<AllConfigurations>):Promise<void> {
    this._devices = await Promise.all(configuration.map(async (deviceConfig) => {
      const c:any = constructorMap.get(deviceConfig.type);
      if (c === undefined) {
        throw new Error(`${deviceConfig.type} device class not found!`);
      }
      log.debug('Creating Rack Device', c);
      const instance:AbstractAudioDevice = await c.create(this.audioContext, deviceConfig);
      return instance;
    }));

    configuration.forEach((deviceConfiguration) => {
      deviceConfiguration.outgoingAudioConnections?.forEach((conn) => {
        const fromDevice = this.getDeviceById(deviceConfiguration.id);
        const toDevice = this.getDeviceById(conn.toDeviceId);
        log.debug('making audio connections', fromDevice, conn.fromAudioPortIndex, toDevice, conn.toAudioPortIndex);
        connect(fromDevice.audioPorts[conn.fromAudioPortIndex], toDevice.audioPorts[conn.toAudioPortIndex]);
        // fromDevice.connectAudioOutput(fromDevice.audioOutputs[conn.fromAudioPortIndex], toDevice, toDevice.audioInputs[conn.toAudioPortIndex]);
      });

      deviceConfiguration.outgoingMidiConnections?.forEach((conn) => {
        const fromDevice = this.getDeviceById(deviceConfiguration.id);
        const toDevice = this.getDeviceById(deviceConfiguration.id);
        log.debug('making midi connections', fromDevice, conn.fromMidiPortIndex, toDevice, conn.toMidiPortIndex);
        connect(fromDevice.audioPorts[conn.fromMidiPortIndex], toDevice.audioPorts[conn.toMidiPortIndex]);
      });
    });
  }

  public getDeviceById<T extends AbstractAudioDevice>(id: string):T {
    const dev = this._devices.find((d) => d.id === id);
    if (dev === undefined) {
      throw new Error(`Device not found. ID:${id}`);
    }
    return dev as T;
  }

  public get devices() {
    return this._devices;
  }
}
