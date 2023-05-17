export enum View {
    FRONT,
    BACK
}


export interface VisualPort<T> {
    element: Element;
    port: T;
}

export interface MidiPort {
    componentId: string;
    name: string;
    direction: PortDirection;
    midi: EventTarget;
}

export interface AudioPort {
    componentId: string;
    name: string;
    direction: PortDirection;
    audioNode: AudioNode;
}

export enum PortDirection {
    OUT,
    IN,
}