import { derived, writable } from "svelte/store";
import { View, type AudioPort, type VisualPort, type MidiPort } from './lib/Components/types.d';

export const audioConnections = writable(new Map<AudioPort, AudioPort>());
export const midiConnections = writable(new Map<MidiPort, MidiPort>());
export const audioPortElements = writable(new Map<AudioPort, Element>());
export const midiPortElements = writable(new Map<MidiPort, Element>());
export const audioContext = writable<AudioContext>();
export const view = writable<View>(View.FRONT);
