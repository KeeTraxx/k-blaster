<script lang="ts">
    import { derived, writable } from "svelte/store";
    import { audioConnections, view, audioPortElements } from "../../stores";
    import { View } from "../Components/types.d";
    import { node1 } from "./audioport";
    import {
        line,
        curveBasis,
        range,
        forceSimulation,
        pairs,
        forceCollide,
        forceLink,
        forceY,
    } from "d3";

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

    const cables = derived(
        [audioConnections, audioPortElements, resized],
        ([connections, visualPorts]) => {
            return [...connections.entries()]
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
    const floating = derived(node1, ($node1) =>
        $node1 ? center($audioPortElements.get($node1)) : undefined
    );
    function mousemove(el: Element) {
        const move = (ev) => (mouseEvent = ev);
        const up = (ev) => node1.set(undefined);

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
                cableNodes[0].fx = newFrom.x;
                cableNodes[0].fy = newFrom.y;

                cableNodes[cableNodes.length - 1].fx = newTo.x;
                cableNodes[cableNodes.length - 1].fy = newTo.y;

                sim.alpha(1);
                sim.restart();
            },
            destroy: () => {},
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
        {#each $cables as cable}
            <path use:cablePhysics={cable} />
        {/each}
        {#if $floating}
            <path use:mousemove use:cablePhysics={[{x: $floating.x, y: $floating.y}, {x: mouseEvent?.clientX || $floating.x, y: mouseEvent?.clientY || $floating.y}]} />
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
        stroke: red;
        stroke-width: 2px;
        stroke-linecap: round;
        fill: none;
    }
</style>
