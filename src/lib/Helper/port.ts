import { get, writable } from "svelte/store";
import { connections, visualPorts } from "../../stores";
import { type Port, type VisualPort, PortDirection } from "../Components/types.d";

export const node1 = writable<VisualPort>();


const mouseDown = (ev: Event, port: Port) => {
    let otherPort = disconnect(port);
    if (!otherPort) {
        node1.set(get(visualPorts).get(port));
        return;
    }

    node1.set(get(visualPorts).get(otherPort));
}

const disconnect = (port: Port) => {
    let connection = [...get(connections).entries()].find(d => d[0] === port || d[1] === port);

    if (!connection) {
        return undefined;
    }

    connection[0].audioNode.disconnect(connection[1].audioNode);
    connections.update(conns => {
        conns.delete(connection[0]);
        return conns;
    });
    console.log('disconnected', connection);

    return connection[0] === port ? connection[1] : connection[0];
}

const mouseUp = (ev: Event, port: Port) => {
    ev.stopPropagation();
    try {
        connect(get(node1).port, port);
    } catch(err) {
        console.warn(err);
    } finally {
        node1.set(undefined);
    }
}

export function connect(fromPort: Port, toPort: Port) {
    let outPort: Port;

    if (fromPort.direction === PortDirection.OUT) {
        outPort = fromPort;
    }

    if (toPort.direction === PortDirection.OUT) {
        outPort = toPort;
    }

    if (!outPort) {
        throw new Error("No OUT Port");
    }

    let inPort: Port;
    if (fromPort.direction === PortDirection.IN) {
        inPort = fromPort;
    }

    if (toPort.direction === PortDirection.IN) {
        inPort = toPort;
    }

    if (!inPort) {
        throw new Error("No IN Port");
    }

    if ([...get(connections).entries()].some(d => d.includes(inPort) || [...d].includes(outPort))) {
        throw new Error("A port already connected");
    }

    console.log('CONNECTING', outPort, inPort)

    outPort.audioNode.connect(inPort.audioNode);

    connections.update(m => m.set(outPort, inPort));
}

export function port(element: Element, port: Port) {
    element.addEventListener('mousedown', ev => mouseDown(ev, port));
    element.addEventListener('mouseup', ev => mouseUp(ev, port));
    visualPorts.update($visualPorts => $visualPorts.set(port, { element, port }));

    return {
        destroy() {
            visualPorts.update($visualPorts => {
                $visualPorts.delete(port);
                return $visualPorts;
            });
        }
    }
}
