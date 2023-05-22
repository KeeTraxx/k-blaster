import { get, writable } from "svelte/store";
import { audioConnections, audioPortElements } from "../../stores";
import { type AudioPort, PortDirection, type MidiPort } from "../Components/types";

export const floatingAudioPort = writable<AudioPort>();


const mouseDown = (ev: Event, port: AudioPort) => {
    let otherPort = disconnect(port);
    if (!otherPort) {
        floatingAudioPort.set(port);
        return;
    }

    floatingAudioPort.set(port);
}

const disconnect = (port: AudioPort) => {
    let connection = [...get(audioConnections).entries()].find(d => d[0] === port || d[1] === port);

    if (!connection) {
        return undefined;
    }

    connection[0].audioNode.disconnect(connection[1].audioNode);
    audioConnections.update(conns => {
        conns.delete(connection[0]);
        return conns;
    });
    console.log('disconnected', connection);

    return connection[0] === port ? connection[1] : connection[0];
}

const mouseUp = (ev: Event, port: AudioPort) => {
    ev.stopPropagation();
    try {
        connect(get(floatingAudioPort), port);
    } catch(err) {
        console.warn(err);
    } finally {
        floatingAudioPort.set(undefined);
    }
}

export function connect(fromPort: AudioPort, toPort: AudioPort) {
    let outPort: AudioPort;

    if (fromPort.direction === PortDirection.OUT) {
        outPort = fromPort;
    }

    if (toPort.direction === PortDirection.OUT) {
        outPort = toPort;
    }

    if (!outPort) {
        throw new Error("No OUT Port");
    }

    let inPort: AudioPort;
    if (fromPort.direction === PortDirection.IN) {
        inPort = fromPort;
    }

    if (toPort.direction === PortDirection.IN) {
        inPort = toPort;
    }

    if (!inPort) {
        throw new Error("No IN Port");
    }

    if ([...get(audioConnections).entries()].some(d => d.includes(inPort) || [...d].includes(outPort))) {
        throw new Error("A port already connected");
    }

    console.log('CONNECTING', outPort, inPort)

    outPort.audioNode.connect(inPort.audioNode);

    audioConnections.update(m => m.set(outPort, inPort));
}

export function audioPort(element: Element, port: AudioPort) {
    element.addEventListener('mousedown', ev => mouseDown(ev, port));
    element.addEventListener('mouseup', ev => mouseUp(ev, port));
    audioPortElements.update($visualPorts => $visualPorts.set(port, element));

    return {
        destroy() {
            audioPortElements.update($visualPorts => {
                $visualPorts.delete(port);
                return $visualPorts;
            });
        }
    }
}
