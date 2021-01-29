import type { AudioPort, GenericPort, MidiPort } from 'src/types';
import { portMap } from '../store/CableStore';
import log from '../helper/Logger';

function connectAudioPort(outputPort:AudioPort, inputPort:AudioPort) {
  if (outputPort.connection !== undefined) {
    log.debug('already connected.');
    return;
  }

  const op = outputPort;
  const ip = inputPort;
  op.node.connect(inputPort.node);

  op.connection = inputPort;
  ip.connection = outputPort;
}

function disconnectAudioPort(outputPort:AudioPort, inputPort:AudioPort) {
  if (outputPort.connection === undefined) {
    log.warn('Ports are not connected.');
  }

  const op = outputPort;
  const ip = inputPort;

  op.node.disconnect(inputPort.node);
  delete op.connection;
  delete ip.connection;
}

function connectMidiPort(outputPort:MidiPort, inputPort:MidiPort) {
  if (outputPort.connection !== undefined) {
    log.debug('already connected.');
    return;
  }

  const listener = (e:WebMidi.MIDIMessageEvent) => inputPort.node.emit('midimessage', e);

  const op = outputPort;
  const ip = inputPort;

  op.node.addEventListener('midimessage', listener);
  op.listener = listener;
  ip.listener = listener;

  op.connection = inputPort;
  ip.connection = outputPort;
}

function disconnectMidiPort(outputPort:MidiPort, inputPort:MidiPort) {
  if (outputPort.connection === undefined) {
    log.warn('Ports are not connected.');
  }

  const op = outputPort;
  const ip = inputPort;

  if (op.listener !== undefined) {
    outputPort.node.removeEventListener('midimessage', op.listener);
  }

  delete op.connection;
  delete op.listener;
  delete ip.connection;
  delete ip.listener;
}

export function disconnect(port:GenericPort):GenericPort | undefined {
  if (port.connection) {
    switch (port.type) {
      case 'audio':
      {
        const outputPort = (port.isOutput ? port : port.connection) as AudioPort;
        const inputPort = (!port.isOutput ? port : port.connection) as AudioPort;
        const c = port.connection;
        disconnectAudioPort(outputPort, inputPort);
        portMap.update((m) => m);
        return c;
      }
      case 'midi':
      {
        const outputPort = (port.isOutput ? port : port.connection) as MidiPort;
        const inputPort = (!port.isOutput ? port : port.connection) as MidiPort;
        const c = port.connection;
        disconnectMidiPort(outputPort, inputPort);
        portMap.update((m) => m);
        return c;
      }
      default:
        throw new Error(`Unknown port type${port.type}`);
    }
  }
  return undefined;
}

export function connect(port1:GenericPort, port2:GenericPort) {
  if (port1.connection === undefined && port2.connection === undefined) {
    if (port1.type !== port2.type) {
      log.error('Ports are not of the same type!');
      return;
    }

    if (port1.isOutput === port2.isOutput) {
      log.error('Can only connect outputs to inputs');
      return;
    }

    const outputPort = port1.isOutput ? port1 : port2;
    const inputPort = !port1.isOutput ? port1 : port2;

    switch (outputPort.type) {
      case 'audio':
        log.info('Connecting audioports', outputPort, inputPort);
        connectAudioPort(outputPort as AudioPort, inputPort as AudioPort);
        portMap.update((m) => m);
        break;
      case 'midi':
        log.info('Connecting MIDI', outputPort, inputPort);
        connectMidiPort(outputPort as MidiPort, inputPort as MidiPort);
        portMap.update((m) => m);
        break;
      default:
        log.error(`Unknown Port type${outputPort.type}`);
        break;
    }
  } else {
    log.error('Ports already have connections');
  }
}
