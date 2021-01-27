import { writable, derived } from 'svelte/store';
import { centerPos, svgPos } from '../Util';
import type { Port } from '../types';

export const startPort = writable<Port|undefined>(undefined);

export const portMap = writable<Map<any, Port>>(new Map());
// @ts-ignore
export const svgStore = writable<SVGSVGElement>(document.createElement('svg') as SVGSVGElement);
export const transform = writable<{x:number, y:number, k: number}>({ x: 0, y: 0, k: 1 });
export const clientPos = writable<{x:number, y:number}>({ x: 0, y: 0 });

export const cables = derived([portMap, svgStore, transform], ([$portMap, $svgStore, $transform]) => {
  if ($svgStore) {
    return [...$portMap.values()]
      .filter((p) => p.isOutput)
      .filter((p) => p.element)
      .filter((p) => p.connectedTo?.element)
      .map((p) => {
        if (p.element && p.connectedTo?.element) {
          const { x: x1, y: y1 } = centerPos(p.element.getBoundingClientRect(), $svgStore);
          const { x: x2, y: y2 } = centerPos(p.connectedTo.element.getBoundingClientRect(), $svgStore);
          return {
            x1: (x1 - $transform.x) / $transform.k,
            y1: (y1 - $transform.y) / $transform.k,
            x2: (x2 - $transform.x) / $transform.k,
            y2: (y2 - $transform.y) / $transform.k,
          };
        }
        return undefined;
      });
  }
  return [];
});

export const floatingCable = derived([startPort, svgStore, transform, clientPos], ([$startPort, $svgStore, $transform, $clientPos]) => {
  if ($startPort?.element?.getBoundingClientRect) {
    const { x: x1, y: y1 } = centerPos($startPort?.element?.getBoundingClientRect(), $svgStore);
    const { x: x2, y: y2 } = svgPos($clientPos, $svgStore);
    return {
      x1: (x1 - $transform.x) / $transform.k,
      y1: (y1 - $transform.y) / $transform.k,
      x2: (x2 - $transform.x) / $transform.k,
      y2: (y2 - $transform.y) / $transform.k,
    };
  }
  return undefined;
});
