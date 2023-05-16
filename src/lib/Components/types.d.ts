export enum View {
    FRONT,
    BACK
}


export interface VisualPort {
    element: Element;
    port: Port;
}


export interface Port {
    componentId: string;
    name: string;
    direction: PortDirection;
    audioNode: AudioNode;
}

export enum PortType {
    AUDIO,
    MIDI,
}

export enum PortDirection {
    OUT,
    IN,
}