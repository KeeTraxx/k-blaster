<script>
import Port from "../controls/Port.svelte";

    export let front: boolean;
    let midiAccess: WebMidi.MIDIAccess;
    let inputMap:WebMidi.MIDIInputMap;
    let outputMap:WebMidi.MIDIOutputMap;
    export let audioContext: AudioContext;

    init();

    async function init() {
        midiAccess = await window.navigator.requestMIDIAccess({sysex: true});
        midiAccess.addEventListener("statechange", () => updatePorts());
        updatePorts();
    }

    function updatePorts() {
        inputMap = midiAccess.inputs;
        outputMap = midiAccess.outputs;
    }
</script>

<style>
    text {
        pointer-events: none;
        user-select: none;
    }
</style>

{#if front}
    <g>
        <rect width="960" height="200" fill="#eee" rx={3} />
        <text x="20" y="20">{midiAccess}</text>
    </g>
{:else}
    <g>
        <rect width="960" height="200" fill="#eee" />
        <g transform="translate(100,20)">
            {#each [...inputMap.values()] as input}
                <Port isOutput={true} node={input} type="midi" label={input.name} />
            {/each}
        </g>
    </g>
{/if}
