import { group } from 'd3';
import type { AudioPort } from 'src/types';
import type { DeviceConfiguration } from 'types/k-blaster';
import log from '../helper/Logger';
import AbstractAudioDevice from './AbstractAudioDevice';

export interface HostAudioConfiguration extends DeviceConfiguration {

}

export class HostAudio extends AbstractAudioDevice {
  constructor(audioContext:AudioContext, initialConfiguration: DeviceConfiguration) {
    super(audioContext, initialConfiguration);
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      this._audioPorts = await this.scanPorts();
    });
  }

  async boot() {
    await super.boot();
    this._audioPorts = await this.scanPorts();
  }

  async scanPorts():Promise<Array<AudioPort<this>>> {
    log.debug('Updating HostAudio Ports...');
    await navigator.mediaDevices.getUserMedia({ audio: {} });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const deviceByType = group(devices, (d) => d.kind);

    const ports:Array<AudioPort<this>> = [];

    const outputDevices = deviceByType.get('audiooutput');
    if (outputDevices) {
      const inputPorts = outputDevices.map((outputDevice) => {
        const audio = new Audio();
        const node = this.audioContext.createMediaStreamDestination();
        audio.srcObject = node.stream;
        audio.play();
        const audioPort:AudioPort<this, MediaStreamAudioDestinationNode> = {
          description: outputDevice.groupId,
          type: 'audio',
          isOutput: false,
          label: outputDevice.label,
          device: this,
          node,
          isDefault: outputDevice.deviceId === 'default',
        };
        return audioPort;
      });
      ports.push(...inputPorts);
    }

    const inputDevices = deviceByType.get('audioinput');

    if (inputDevices) {
      const outputPorts = await Promise.all(inputDevices.map(async (inputDevice) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: inputDevice.deviceId } });
        const node = this.audioContext.createMediaStreamSource(stream);
        const audioPort:AudioPort<this, MediaStreamAudioSourceNode> = {
          description: inputDevice.groupId,
          type: 'audio',
          isOutput: true,
          label: inputDevice.label,
          device: this,
          node,
          isDefault: inputDevice.deviceId === 'default',
        };
        return audioPort;
      }));
      ports.push(...outputPorts);
    }
    log.debug(ports);
    return ports;
  }

  get defaultAudioPort():AudioPort<this> | undefined {
    return this._audioPorts.find((port) => !port.isOutput && port.isDefault);
  }
}
