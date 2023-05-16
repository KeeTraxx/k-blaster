import { derived, writable } from "svelte/store";
import { View, type Port, type VisualPort } from './lib/Components/types.d';

export const connections = writable(new Map<Port, Port>());
export const visualPorts = writable(new Map<Port, VisualPort>());
export const audioContext = writable<AudioContext>();
export const view = writable<View>(View.FRONT);
