<script>
    import type { MidiReceiver } from "src/lib/MidiReceiver";

    import { onDestroy, onMount } from "svelte";
    import { startPort, portMap } from "../store/CableStore";
    import type { Port } from "../types";

    export let x: number = 0;
    export let y: number = 0;
    export let label: string = "";
    export let isOutput: boolean;
    export let node: any;
    export let type: string;

    let element: SVGGraphicsElement;
    let port: Port;
    {
        if (!$portMap.has(node)) {
            port = {
                isOutput,
                node,
                type,
            };
            $portMap.set(node, port);
        } else {
            // @ts-ignore
            port = $portMap.get(node);
        }
    }

    onMount(() => {
        portMap.update((m) => {
            port.element = element;
            return m;
        });
    });

    onDestroy(() => {
        port.element = undefined;
    });

    function start(ev: Event) {
        startPort.set(port.connectedTo || port);
        disconnect();
        console.log("start", ev);
        const mouseUpListener = (ev: MouseEvent) => {
            console.log("mousup", ev);
            const el = ev.target;
            console.log(el);
            ev.preventDefault();

            connect(
                port,
                [...$portMap.values()].find((p) => p.element === el)
            );
            startPort.set(undefined);
            window.removeEventListener("mouseup", mouseUpListener);
        };

        const touchEndListener = (ev: TouchEvent) => {
            console.log("touchup", ev);
            if (ev.changedTouches.length === 1) {
                const touch = ev.changedTouches[0];
                const el = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                );
                console.log(el);
                connect(
                    port,
                    [...$portMap.values()].find((p) => p.element === el)
                );
                ev.preventDefault();
            }
            startPort.set(undefined);
            window.removeEventListener("touchend", touchEndListener);
        };

        window.addEventListener("mouseup", mouseUpListener);
        window.addEventListener("touchend", touchEndListener);
    }

    function disconnect() {
        if (!port.connectedTo) return;

        const output = port.isOutput ? port : port.connectedTo;
        const input = port.isOutput ? port.connectedTo : port;

        output.connectedTo = undefined;
        input.connectedTo = undefined;

        if (output.node instanceof AudioNode) {
            console.log("disconnect Audionodes!");
            output.node.disconnect(input.node);
        } else if (output.type === "midi") {
            output.node.removeEventListener("midimessage", output.node.listener);
        }
        portMap.update((m) => m);
    }

    function connect(a: Port, b: Port | undefined) {
        if (b === undefined) {
            console.warn("No end port found");
            return;
        }

        if (a.type !== b.type) {
            console.warn("Ports not of same type", a, b);
            return;
        }

        if (a.isOutput === b.isOutput) {
            console.warn(
                "Can only connect output with inputs",
                a,
                b
            );
            return;
        }

        const output = a.isOutput ? a : b;
        const input = a.isOutput ? b : a;

        output.connectedTo = input;
        input.connectedTo = output;

        if (output.node instanceof AudioNode) {
            console.log("connect Audionodes!");
            output.node.connect(input.node);
        } else if (output.type === "midi") {
            console.log("connect Midi Nodes! But not implemented yet...", output, input, output.node.addListener);
            const midiReceiver: MidiReceiver = input.node;
            const midiEmitter: MIDIOutput = output.node;
            const listener = (ev) => midiReceiver.emit('midimessage', ev);
            midiEmitter.listener = listener;
            midiEmitter.addEventListener('midimessage', listener);
        }

        portMap.update((m) => m);
    }
</script>

<style>
    circle {
        stroke: silver;
        fill: #333;
        stroke-width: 2px;
    }
    text {
        text-anchor: middle;
        font-size: 80%;
    }
</style>

<text {x} y={y - 8}>{label}</text>
<circle
    r="5"
    cx={x}
    cy={y}
    bind:this={element}
    on:mousedown|stopPropagation={(e) => start(e)}
    on:touchstart|stopPropagation={(e) => start(e)} />
