<script lang="ts">
    import {
        curveBasis,
        forceCollide,
        forceLink,
        forceSimulation,
        forceY,
        line,
        pairs,
        range,
    } from "d3";
    import { derived, writable } from "svelte/store";
    import {
        audioConnections,
        audioPortElements,
        midiConnections,
        midiPortElements,
        view,
    } from "../../stores";
    import { View } from "../Components/types";
    import { floatingAudioPort } from "./audioport";
    import { floatingMidiPort } from "./midiport";

    let mouseEvent: MouseEvent = undefined;
    let resized = writable();

    function center(el: Element): { x: number; y: number } {
        if (!el) {
            return undefined;
        }
        const rect = el.getBoundingClientRect();
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
    }

    const pathDrawer = line<Position>()
        .x((d) => d.x || 0)
        .y((d) => d.y || 0)
        .curve(curveBasis);

    const audioCables = derived(
        [audioConnections, audioPortElements, resized],
        ([$audioConnections, $audioPortElements]) => {
            return [...$audioConnections.entries()]
                .map(
                    (c) =>
                        [
                            center($audioPortElements.get(c[0])),
                            center($audioPortElements.get(c[1])),
                        ] as [Position, Position]
                )
                .filter(Boolean);
        }
    );

    const midiCables = derived(
        [midiConnections, midiPortElements, resized],
        ([$midiConnections, $midiPortElements]) => {
            return [...$midiConnections.entries()]
                .map(
                    (c) =>
                        [
                            center($midiPortElements.get(c[0])),
                            center($midiPortElements.get(c[1])),
                        ] as [Position, Position]
                )
                .filter(Boolean);
        }
    );

    const floating = derived(
        [floatingAudioPort, floatingMidiPort],
        ([$floatingAudioPort, $floatingMidiPort]) => {
            if ($floatingAudioPort) {
                return center($audioPortElements.get($floatingAudioPort));
            }

            if (floatingMidiPort) {
                return center($midiPortElements.get($floatingMidiPort));
            }
            return undefined;
        }
    );
    function mousemove(el: Element) {
        const move = (ev) => (mouseEvent = ev);
        const up = (ev) => {
            floatingAudioPort.set(undefined);
            floatingMidiPort.set(undefined);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
        return {
            destroy: () => {
                mouseEvent = undefined;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            },
        };
    }

    function cablePhysics(
        el: SVGPathElement,
        [from, to]: [Position, Position]
    ) {
        console.log(el, from, to);
        if (!from || !to) {
            return;
        }
        const CABLE_PARTS = 5;
        let distance = () =>
            Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        const cableNodes: Array<any> = range(CABLE_PARTS).map(() => ({}));
        cableNodes[0].fx = from.x;
        cableNodes[0].fy = from.y;

        cableNodes[cableNodes.length - 1].fx = to.x;
        cableNodes[cableNodes.length - 1].fy = to.y;
        const sim = forceSimulation(cableNodes)
            .force("gravity", forceY(2000).strength(0.005))
            .force(
                "link",
                forceLink()
                    .links(
                        pairs(cableNodes).map(([source, target]) => ({
                            source,
                            target,
                        }))
                    )
                    .distance(distance() / CABLE_PARTS)
                    .strength(0.9)
            )
            .force("collide", forceCollide(20));
        sim.on("tick", () => el.setAttribute("d", pathDrawer(cableNodes)));
        return {
            update: ([newFrom, newTo]) => {
                if (!newFrom || !newTo) {
                    return;
                }
                cableNodes[0].fx = newFrom.x;
                cableNodes[0].fy = newFrom.y;

                cableNodes[cableNodes.length - 1].fx = newTo.x;
                cableNodes[cableNodes.length - 1].fy = newTo.y;

                sim.alpha(1);
                sim.restart();
            },
            destroy: () => {
                console.log('wanna destroy');
            }
        };
    }

    function down(ev: MouseEvent) {
        mouseEvent = ev;
    }

    interface Position {
        x: number;
        y: number;
    }
</script>

<svelte:window
    on:mousedown={(ev) => down(ev)}
    on:resize={(ev) => resized.set(ev)}
/>

{#if $view === View.BACK}
    <svg>
        {#each $audioCables as cable}
            <path class="audio" use:cablePhysics={cable} />
        {/each}
        {#each $midiCables as cable}
            <path class="midi" use:cablePhysics={cable} />
        {/each}
        {#if $floating}
            <path
                class="audio"
                use:mousemove
                use:cablePhysics={[
                    { x: $floating.x, y: $floating.y },
                    {
                        x: mouseEvent?.clientX || $floating.x,
                        y: mouseEvent?.clientY || $floating.y,
                    },
                ]}
            />
        {/if}
    </svg>
{/if}

<style>
    svg {
        pointer-events: none;
        width: 100vw;
        height: 100vh;
    }

    path {
        stroke-linecap: round;
        fill: none;
    }

    path.audio {
        stroke: red;
        stroke-width: 2px;
    }

    path.midi {
        stroke: blue;
        stroke-width: 2px;
    }
</style>
