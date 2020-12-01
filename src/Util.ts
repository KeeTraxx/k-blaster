import { svg } from "d3";

export function svgPos({ x, y }: { x: number, y: number }, svg: SVGSVGElement): {x:number, y:number} {
    var offset = svg.getBoundingClientRect();
  
    var matrix = svg.getScreenCTM()?.inverse();
    if (matrix != null) {
        return {
            x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
            y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
          };
    } else {
        return {x: 0, y:0}
    }
}

export function centerPos(rect:DOMRect, svg:SVGSVGElement) {
    return svgPos(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        svg
    )
}
