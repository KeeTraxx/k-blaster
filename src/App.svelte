<script lang="ts">
    import { View } from "./lib/Components/types.d";
    import Cables from "./lib/Helper/Cables.svelte";
    import { audioContext, view } from "./stores";
    import type { Component } from "./lib/Components/Component";
    import { Mixer } from "./lib/Components/Mixer/Mixer";
    import MixerSvelte from "./lib/Components/Mixer/Mixer.svelte";
    import HardwareIoSvelte from "./lib/Components/HardwareIO/HardwareIO.svelte";
    import { HardwareIO } from "./lib/Components/HardwareIO/HardwareIO";
    import OscillatorSvelte from "./lib/Components/Oscillator/Oscillator.svelte";
    import { Oscillator } from "./lib/Components/Oscillator/Oscillator";
    import MidiPlayerSvelte from "./lib/Components/MidiPlayer/MidiPlayer.svelte";
    import { MidiPlayer } from "./lib/Components/MidiPlayer/MidiPlayer";

    let components: Array<Component>;
    
    const svelteComponents = {
        "Mixer": MixerSvelte,
        "HardwareIO": HardwareIoSvelte,
        "Oscillator": OscillatorSvelte,
        "MidiPlayer": MidiPlayerSvelte
    }

    function k(event: KeyboardEvent) {
        if (event.key === "Tab") {
            $view = $view === View.FRONT ? View.BACK : View.FRONT;
            event.preventDefault();
        }
    }

    audioContext.subscribe(ctx => {
        if(ctx) {
            components = [
                new HardwareIO(ctx, "io"),
                new Mixer(ctx, "mixer-0"),
                new Oscillator(ctx, "oscillator-0"),
                new MidiPlayer("midiplayer")
            ]
        }
    });
</script>

<svelte:window on:keydown={k} />

{#if $audioContext}
    <div class="layers">
        <main>
            {#each components as c}
                <svelte:component this={svelteComponents[c.type]} config={c} />
            {/each}
        </main>
        <aside>
            <Cables />
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
        pointer-events: none;
    }

    main,
    aside {
        inset: 0;
    }

    aside {
        pointer-events: none;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
