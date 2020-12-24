import { centerPos } from "../Util";
import { writable, derived } from "svelte/store";
import type {Port} from "../types";

export const startPort = writable<Port|undefined>(undefined);

export const portMap = writable<Map<any, Port>>(new Map());
// @ts-ignore
export const svgStore = writable<SVGSVGElement>(document.createElement("svg") as SVGSVGElement);

export const cables = derived([portMap, svgStore], ([$portMap, $svgStore]) => 
{
  if ($svgStore) {
    return [...$portMap.values()]
    .filter( p => p.isOutput)
    .filter(p => p.element)
    .filter(p => p.connectedTo?.element)
    .map(p => {
      if (p.element && p.connectedTo?.element) {
        const {x:x1,y:y1} = centerPos(p.element.getBoundingClientRect(), $svgStore);
        const {x:x2,y:y2} = centerPos(p.connectedTo.element.getBoundingClientRect(), $svgStore);
        return {x1,y1,x2,y2};
      } else {
        return undefined;
      }
    })
  } else {
    return [];
  }
});