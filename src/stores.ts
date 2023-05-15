import { derived, writable } from "svelte/store";
import {View} from './lib/Components/types.d';

export const audioOutPorts = new Set<Port>();
export const audioInPorts = new Set<Port>();
export const connections = writable(new Map<Port, Port>());

export const audioContext = writable<AudioContext>();
export const view = writable<View>(View.FRONT);

export interface Port {
    componentId: string;
    name: string;
    element: Element;
    audioNode: AudioNode;
}

export interface PortParams extends Omit<Port, "element"> {}