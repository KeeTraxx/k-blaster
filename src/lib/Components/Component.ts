import type { Port } from "./types";

export abstract class Component {
    constructor() {

    }

    public getPort(name: string): Port {
        const port = [...this.ports].find(p => p.name === name);
        if (port) {
            return port;
        }

        throw new Error(`Port ${name} not found`);
    }

    public abstract readonly ports : Immutable.Set<Port>;
    public abstract readonly type : string;
}