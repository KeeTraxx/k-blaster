<script lang="ts">
    import { derived } from "svelte/store";
    import { connections, view, visualPorts } from "../../stores";
    import { View } from "../Components/types.d";
    import { node1 } from "./port";

    let mouseEvent: MouseEvent = undefined;

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

    const cables = derived([connections, visualPorts], ([connections, visualPorts]) => {
        return [...connections.entries()].map((c) => [
            center($visualPorts.get(c[0])?.element),
            center($visualPorts.get(c[1])?.element),
        ]).filter(Boolean);
    });
    const floating = derived(node1, ($node1) => ($node1 ? center($node1.element) : undefined));
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

    function down(ev: MouseEvent) {
        mouseEvent = ev;
    }
</script>

<svelte:window on:mousedown={(ev) => down(ev)} />

{#if $view === View.BACK}
    <svg>
        {#each $cables as conn}
            <line x1={conn[0].x} y1={conn[0].y} x2={conn[1].x} y2={conn[1].y} />
        {/each}
        {#if $floating}
            <line
                use:mousemove
                x1={$floating.x}
                y1={$floating.y}
                x2={mouseEvent?.clientX || $floating.x}
                y2={mouseEvent?.clientY || $floating.y}
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

    line {
        stroke: red;
        stroke-width: 2px;
        stroke-linecap: round;
    }
</style>
