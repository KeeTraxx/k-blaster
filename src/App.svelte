<script lang="ts">
    import Component from "./lib/Components/Component.svelte";
    import { View } from "./lib/Components/types.d";
    import Cables from "./lib/Helper/Cables.svelte";
    import { audioContext } from "./stores";
    let view = View.FRONT;

    function k(event: KeyboardEvent) {
        if (event.key === "Tab") {
            view = view === View.FRONT ? View.BACK : View.FRONT;
            event.preventDefault();
        }
    }
</script>

<svelte:window on:keydown={k} />

{#if $audioContext}
    <main>
        <div>
            <Component component="Mixer" props={{ view }} />
        </div>
        <Cables {view} />
    </main>
{:else}
    <button on:click={() => ($audioContext = new AudioContext())}>START</button>
{/if}

<style>
    :global(main > *) {
        position: absolute;
        top: 0;
        left: 0;
    }

    :global(text) {
        user-select: none;
    }
</style>
