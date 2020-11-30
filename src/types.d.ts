export interface AudioPort<T extends AudioNode> extends T {
    element?: SVGGElement;
    isOutput: boolean;
    connection?: AudioPort
}

export interface MidiNote {
    pitch: number;
    velocity: number;
    channel: number;
}