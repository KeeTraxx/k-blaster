import { Writable, writable } from "svelte/store";
import type {Port} from "../types";

export const tempCable:Writable<[Port | undefined, Port | undefined]> = writable<[Port | undefined, Port | undefined]>([undefined, undefined]);

export const cables:Writable<Array<[Port, Port]>> = writable<Array<[Port, Port]>>([]);