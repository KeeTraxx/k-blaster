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

export function centerPos(rect:DOMRect, svg:SVGGraphicsElement): {x:number, y:number} {
    return svgPos(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        svg
    )
}

export function svgScale(svg:SVGGraphicsElement) :number | undefined{
    return svg.getScreenCTM()?.inverse().a;
}

export interface MidiEvent {
    command: number;
    channel: number;
    timestamp: number;
    data1: number;
    data2: number;
}

export function parseMidiEvent(e:any):MidiEvent {
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


export enum MIDI_COMMANDS {
    noteoff = 0x8,           // 8
    noteon = 0x9,            // 9
    keyaftertouch = 0xA,     // 10
    controlchange = 0xB,     // 11
    channelmode = 0xB,       // 11
    nrpn = 0xB,              // 11
    programchange = 0xC,     // 12
    channelaftertouch = 0xD, // 13
    pitchbend = 0xE          // 14
}

export enum MIDI_EVENTS {
    // System common messages
    sysex = 0xF0,            // 240
    timecode = 0xF1,         // 241
    songposition = 0xF2,     // 242
    songselect = 0xF3,       // 243
    tuningrequest = 0xF6,    // 246
    sysexend = 0xF7,         // 247 (never actually received - simply ends a sysex)

    // System real-time messages
    clock = 0xF8,            // 248
    start = 0xFA,            // 250
    continue = 0xFB,         // 251
    stop = 0xFC,             // 252
    activesensing = 0xFE,    // 254
    reset = 0xFF,            // 255
}