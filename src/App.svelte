<script lang="ts">
    import { View, type AudioAccess } from "./lib/Components/types";
    import Cables from "./lib/Helper/Cables.svelte";
    import { view, audioAccess } from "./stores";
    import type { Component } from "./lib/Components/Component";
    import { Mixer } from "./lib/Components/Mixer/Mixer";
    import MixerSvelte from "./lib/Components/Mixer/Mixer.svelte";
    import HardwareIoSvelte from "./lib/Components/HardwareIO/HardwareIO.svelte";
    import { HardwareIO } from "./lib/Components/HardwareIO/HardwareIO";
    import OscillatorSvelte from "./lib/Components/Oscillator/Oscillator.svelte";
    import { Oscillator } from "./lib/Components/Oscillator/Oscillator";
    import MidiPlayerSvelte from "./lib/Components/MidiPlayer/MidiPlayer.svelte";
    import { MidiPlayer } from "./lib/Components/MidiPlayer/MidiPlayer";
    import defaultConfig from "./rack-configs/default-config.json";
    import { connect as connectMidi } from "./lib/Helper/midiport";
    import { connect as connectAudio } from "./lib/Helper/audioport";

    let components: Array<Component>;


    const componentMap = {
        Mixer: {
            ts: Mixer,
            svelte: MixerSvelte,
        },
        HardwareIO: { ts: HardwareIO, svelte: HardwareIoSvelte },
        Oscillator: { ts: Oscillator, svelte: OscillatorSvelte },
        MidiPlayer: { ts: MidiPlayer, svelte: MidiPlayerSvelte },
    };

    function k(event: KeyboardEvent) {
        if (event.key === "Tab") {
            $view = $view === View.FRONT ? View.BACK : View.FRONT;
            event.preventDefault();
        }
    }

    audioAccess.subscribe(($audioAccess) => {
        if ($audioAccess) {

            const {audioContext, midiAccess} = $audioAccess;

            components = defaultConfig.components.map(
                (c) => new componentMap[c.type].ts(c.id, audioContext, midiAccess)
            );

            defaultConfig.connections.forEach((c) => {
                const fromComponent = components.find(
                    (d) => d.id === c.fromComponentId
                );
                const toComponent = components.find(
                    (d) => d.id === c.toComponentId
                );
                switch (c.type) {
                    case "midi": {
                        const fromPort = fromComponent.getMidiPort(c.fromPort);
                        const toPort = toComponent.getMidiPort(c.toPort);
                        connectMidi(fromPort, toPort);
                        break;
                    }
                    case "audio": {
                        const fromPort = fromComponent.getAudioPort(c.fromPort);
                        const toPort = toComponent.getAudioPort(c.toPort);
                        connectAudio(fromPort, toPort);
                        break;
                    }
                }
            });
        }
    });
</script>

<svelte:window on:keydown={k} />

{#if $audioAccess}
    <div class="layers">
        <main>
            {#each components as c}
                <svelte:component
                    this={componentMap[c.type].svelte}
                    config={c}
                />
            {/each}
        </main>
        <aside>
            <Cables />
        </aside>
    </div>
{:else}
    <button on:click={async () => ($audioAccess = {audioContext: new AudioContext(), midiAccess: await navigator.requestMIDIAccess({software: true})} )}>START</button>
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
