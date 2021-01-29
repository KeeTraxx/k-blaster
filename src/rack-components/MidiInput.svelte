<script>
import Panel from "../controls/Panel.svelte";

    import { onMount } from "svelte";

    import DigitalDisplay from "../controls/DigitalDisplay.svelte";
    import Port from "../controls/PortComponent.svelte";

    export let front: boolean;
    let midiAccess: WebMidi.MIDIAccess;
    let inputMap: WebMidi.MIDIInputMap = new Map();
    let outputMap: WebMidi.MIDIOutputMap = new Map();
    export let audioContext: AudioContext;

    onMount(async () => {
        await init();
    });

    async function init() {
        midiAccess = await window.navigator.requestMIDIAccess({ sysex: true });
        midiAccess.addEventListener("statechange", () => updatePorts());
        updatePorts();
    }

    function updatePorts() {
        inputMap = midiAccess.inputs;
        outputMap = midiAccess.outputs;
    }
</script>

<style>
    g :global(text) {
        pointer-events: none;
        user-select: none;
        fill: white;
    }
</style>

{#if front}
    {#each [...inputMap.values()] as input, i}
        <Panel x={i*120} type="I/O" fill="#aaf" width={120} height={50}>
            <DigitalDisplay
                fontSize="11"
                padding={2}
                y={10}
                x={22}
                width={70}
                text={input.name} />
        </Panel>
    {/each}
{:else}
    {#each [...inputMap.values()] as input, i}
        <Panel x={i*120} type="I/O" fill="#aaf" width={120} height={50}>
            <DigitalDisplay
                fontSize="11"
                padding={2}
                y={10}
                x={22}
                width={70}
                text={input.name} />
            <Port
                y={30}
                x={10}
                isOutput={true}
                node={input}
                type="midi"
                label="IN" />
        </Panel>
    {/each}
{/if}
