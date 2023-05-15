import { get, writable } from "svelte/store";
import { audioOutPorts, audioInPorts, connections, Port } from "../../stores";

export const node1 = writable<Element | undefined>();
export const node2 = writable<Element | undefined>();

const mouseDown = ev => {
    let node = disconnect(ev.target);

    if (!node) {
        node = ev.target;
    }

    node1.set(node);
}

const disconnect = (el:Element) => {
    let connection = [...get(connections).entries()].find(d => d[0].element === el || d[1].element === el);

    if (!connection) {
        return undefined;
    }

    connection[0].audioNode.disconnect(connection[1].audioNode);
    get(connections).delete(connection[0]);
    connections.update(m => {
        if (connection) {
            connection[0] && m.delete(connection[0]);
        }
        return m;
    })
    console.log('disconnected', connection);
    if (connection[0].element === el) {
        return connection[1].element;
    } else {
        return connection[0].element;
    }
}

const mouseUp = (ev:Event) => {
    ev.stopPropagation();
    node2.set(ev.target as Element);

    let from = [...audioOutPorts].find(d => d.element === get(node1) || d.element === get(node2));
    let to = [...audioInPorts].find(d => d.element === get(node1) || d.element === get(node2));

    if (from !== undefined && to !== undefined) {
        console.log('connecting', node1, from, node2, to);
        from.audioNode.connect(to.audioNode);
        connections.update(m => m.set(from as Port, to as Port))
    }

    node1.set(undefined);
    node2.set(undefined);
}

export function audioOut(element: Element, audioNode: AudioNode) {
    audioOutPorts.add({
        element, 
        audioNode
    });

    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('mouseup', mouseUp);

    return {
        destroy() {
            element.removeEventListener('mouseDown', mouseDown);
            element.removeEventListener('mouseUp', mouseUp);
        }
    }
}

export function audioIn(element: Element, audioNode: AudioNode) {
    audioInPorts.add({
        element, 
        audioNode
    });
    
    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('mouseup', mouseUp);

    return {
        destroy() {
            element.removeEventListener('mouseDown', mouseDown);
            element.removeEventListener('mouseUp', mouseUp);
        }
    }
}