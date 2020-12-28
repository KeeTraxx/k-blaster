export interface AudioPort<T extends AudioNode = AudioNode> extends T {
    element?: SVGGElement;
    isOutput: boolean;
    connection?: AudioPort
}

export interface MidiNote {
    pitch: number;
    velocity: number;
    channel: number;
}

export interface Port {
    element?: SVGGraphicsElement;
    type: string;
    isOutput: boolean;
    node: any;
    connectedTo?: Port;
}
