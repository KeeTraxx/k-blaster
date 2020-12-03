export function svgPos({ x, y }: { x: number, y: number }, svg: SVGGraphicsElement): {x:number, y:number} {
    const offset = svg.getBoundingClientRect();
  
    const matrix = svg.getScreenCTM()?.inverse();

    if (matrix) {
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

export function svgScale(svg:SVGGraphicsElement) :number | undefined{
    return svg.getScreenCTM()?.inverse().a;
}