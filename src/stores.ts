import { derived, writable } from "svelte/store";

export const audioOutPorts = new Set<Port>();
export const audioInPorts = new Set<Port>();
export const connections = writable(new Map<Port, Port>());

export const audioContext = writable<AudioContext>();

export interface Port {
    element: Element;
    audioNode: AudioNode;
}