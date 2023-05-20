import { get, writable } from "svelte/store";
import { midiConnections, midiPortElements } from "../../stores";
import { PortDirection, type MidiPort } from "../Components/types.d";

export const floatingMidiPort = writable<MidiPort>();


const mouseDown = (ev: Event, port: MidiPort) => {
    let otherPort = disconnect(port);
    if (!otherPort) {
        floatingMidiPort.set(port);
        return;
    }
    floatingMidiPort.set(port);
}

const disconnect = (port: MidiPort) => {
    let connection = [...get(midiConnections).entries()].find(d => d[0] === port || d[1] === port);

    if (!connection) {
        return undefined;
    }

    midiConnections.update(conns => {
        conns.delete(connection[0]);
        return conns;
    });
    console.log('disconnected', connection);

    /*
    TODO
    connection[0].audioNode.disconnect(connection[1].audioNode);
    */

    return connection[0] === port ? connection[1] : connection[0];
}

const mouseUp = (ev: Event, port: MidiPort) => {
    ev.stopPropagation();
    try {
        connect(get(floatingMidiPort), port);
    } catch (err) {
        console.warn(err);
    } finally {
        floatingMidiPort.set(undefined);
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