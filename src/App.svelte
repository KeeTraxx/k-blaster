<script lang="ts">
    import Component from "./lib/Components/Component.svelte";
    import { View } from "./lib/Components/types.d";
    import Cables from "./lib/Helper/Cables.svelte";
    import { audioContext, audioInPorts, audioOutPorts, view } from "./stores";
    import { TWO_MIXERS } from "./lib/presets";
    import { onMount } from "svelte";
    import { connect } from "./lib/Helper/port";

    function k(event: KeyboardEvent) {
        if (event.key === "Tab") {
            $view = $view === View.FRONT ? View.BACK : View.FRONT;
            event.preventDefault();
        }
    }

    audioContext.subscribe(() => {
        setTimeout(() => {
            TWO_MIXERS.forEach((component) => {
                let outports = [...audioOutPorts.values()];
                let inports = [...audioInPorts.values()];
                console.log(outports, inports);
                component.connections.forEach((connection) => {
                    const p1 = outports.find(
                        (p) =>
                            p.componentId === component.id &&
                            p.name === connection.fromPort
                    );
                    if (!p1) {
                        console.warn("Could not find port", connection);
                        return;
                    }
                    const p2 = inports.find(
                        (p) =>
                            p.componentId === connection.toComponentId &&
                            p.name === connection.toPort
                    );
                    if (!p2) {
                        console.warn("Could not find port", connection);
                        return;
                    }
                    connect(p1, p2);
                });
            });
        }, 200);
    })
</script>

<svelte:window on:keydown={k} />

{#if $audioContext}
    <div class="layers">
        <main>
            {#each TWO_MIXERS as c}
                <Component component={c.component} props={{ id: c.id }} />
            {/each}
        </main>
        <aside>
            <Cables {view} />
        </aside>
    </div>
{:else}
    <button on:click={() => ($audioContext = new AudioContext())}>START</button>
{/if}

<style>
    :global(.layers > *) {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
    }

    :global(text) {
        user-select: none;
    }

    main,
    aside {
        margin: 0;
        padding: 0;
    }

    aside {
        pointer-events: none;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
