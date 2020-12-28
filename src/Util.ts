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

export function centerPos(rect:DOMRect, svg:SVGGraphicsElement) {
    return svgPos(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        svg
    )
}

export function svgScale(svg:SVGGraphicsElement) :number | undefined{
    return svg.getScreenCTM()?.inverse().a;
}

// commands from https://github.com/djipco/webmidi/blob/master/src/webmidi.js

export function parseMidiEvent(e:MidiMessageEvent):MidiEvent {
    const command = e.data[0] >> 4;
    const channel = (e.data[0] & 0xf) + 1;
    let data1, data2;

    if (e.data.length > 1) {
      data1 = e.data[1];
      data2 = e.data.length > 2 ? e.data[2] : undefined;
    }

    // Returned event
    return {
      command,
      channel,
      timestamp: e.timeStamp,
      data1,
      data2
    };
}