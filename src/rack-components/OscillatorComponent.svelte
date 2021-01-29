<script>
    import Port from "../controls/PortComponent.svelte";

    import Panel from "../controls/Panel.svelte";
    import DigitalSelector from "../controls/DigitalSelector.svelte";
    import SvgButton from "../controls/SvgButton.svelte";
    import PeriodicWaveDisplay from "../controls/PeriodicWaveDisplay.svelte";
    import Knob from "../controls/Knob.svelte";
    import type { Oscillator } from "../lib/Oscillator";
    export let device: Oscillator;
    export let front: boolean;
    
    async function testSoundStart() {
        for (let i = 0; i < 8; i++) {
            device.play();
            setTimeout(() => device.stop(), 2000);
        }
    }
</script>

<Panel type="Oscillator" width={960} height={100} fill="#dbb">
    {#if front}
        <DigitalSelector
            on:select={(v) => (device.oscillatorType = v.detail.value)}
            width={50}
            x={10}
            y={10}
            selected={device.oscillatorType}
            items={['sine', 'square', 'triangle', 'custom'].map((label) => ({
                label,
                value: label,
            }))} />
        <SvgButton
            text="SoundTest"
            on:click={() => testSoundStart()}
            x={30}
            y={45} />
        <PeriodicWaveDisplay x={150} y={50} oscillatorType={device.oscillatorType} customCosCoeffs={device.customCosCoeffs} customSinCoeffs={device.customSinCoeffs} />
        <g transform="translate(405, 15)">
            {#each device.customCosCoeffs as cos, i }
                <Knob bind:value={device.customCosCoeffs[i]} x={i*35}  step={0.1} />
            {/each}
            
        </g>
        <g transform="translate(405, 60)">
        {#each device.customSinCoeffs as sin, i }
                <Knob bind:value={device.customSinCoeffs[i]} x={i*35} step={0.1} />
        {/each}
        </g>
        
    {:else}
        <g transform="translate(20,20)">
            <Port
                port={device.audioPorts[0]} label="Audio OUT" />
            <Port
                x={200}
                port={device.midiPorts[0]}
                label="MIDI IN" />
        </g>
    {/if}
</Panel>
