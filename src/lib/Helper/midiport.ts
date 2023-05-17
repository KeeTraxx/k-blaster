import { get, writable } from "svelte/store";
import { midiConnections, audioPortElements, midiPortElements } from "../../stores";
import { type AudioPort, type VisualPort, PortDirection, type MidiPort } from "../Components/types";

export const node1 = writable<MidiPort>();


const mouseDown = (ev: Event, port: MidiPort) => {
    let otherPort = disconnect(port);
    if (!otherPort) {
        node1.set(port);
        return;
    }

    node1.set(port);
}

const disconnect = (port: MidiPort) => {
    let connection = [...get(midiConnections).entries()].find(d => d[0] === port || d[1] === port);

    if (!connection) {
        return undefined;
    }
    /*
    TODO
    connection[0].audioNode.disconnect(connection[1].audioNode);
    audioConnections.update(conns => {
        conns.delete(connection[0]);
        return conns;
    });
    console.log('disconnected', connection);
    */

    return connection[0] === port ? connection[1] : connection[0];
}

const mouseUp = (ev: Event, port: MidiPort) => {
    ev.stopPropagation();
    try {
        connect(get(node1), port);
    } catch(err) {
        console.warn(err);
    } finally {
        node1.set(undefined);
    }
}

export function connect(fromPort: MidiPort, toPort: MidiPort) {
    let outPort: MidiPort;

    if (fromPort.direction === PortDirection.OUT) {
        outPort = fromPort;
    }

    if (toPort.direction === PortDirection.OUT) {
        outPort = toPort;
    }

    if (!outPort) {
        throw new Error("No OUT Port");
    }

    let inPort: MidiPort;
    if (fromPort.direction === PortDirection.IN) {
        inPort = fromPort;
    }

    if (toPort.direction === PortDirection.IN) {
        inPort = toPort;
    }

    if (!inPort) {
        throw new Error("No IN Port");
    }

    if ([...get(midiConnections).entries()].some(d => d.includes(inPort) || [...d].includes(outPort))) {
        throw new Error("A port already connected");
    }

    console.log('CONNECTING', outPort, inPort)

    /*
    TODO outPort.audioNode.connect(inPort.audioNode);
    */

    midiConnections.update(m => m.set(outPort, inPort));
}

export function midiPort(element: Element, port: MidiPort) {
    element.addEventListener('mousedown', ev => mouseDown(ev, port));
    element.addEventListener('mouseup', ev => mouseUp(ev, port));
    midiPortElements.update($visualPorts => $visualPorts.set(port, element));

    return {
        destroy() {
            midiPortElements.update($visualPorts => {
                $visualPorts.delete(port);
                return $visualPorts;
            });
        }
    }
}
