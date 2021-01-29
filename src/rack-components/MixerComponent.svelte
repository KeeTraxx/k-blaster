<script>
    import GainControlComponent from "../controls/GainControlComponent.svelte";
    import PortComponent from "../controls/PortComponent.svelte";
    import Panel from "../controls/Panel.svelte";
    import type { Mixer } from "../lib/Mixer";
    import log from "../helper/Logger";
    export let device: Mixer;
    export let front: boolean;
</script>

<Panel type="Mixer" fill="#c2c2c2">
    {#if front}
        <GainControlComponent
            x={5}
            y={5}
            height={180}
            label="Master"
            port={device.masterOutput}
        />
        {#each device.audioPorts.filter(p => !p.isOutput) as port, i}
            <GainControlComponent
                x={70 + 50 * i}
                y={35}
                height={150}
                label="Input {i + 1}"
                {port}
            />
        {/each}
    {:else}
        <rect width="960" height="200" fill="#c2c2c2" />
        <g transform="translate(40,30)">
            <PortComponent
                port={device.masterOutput}
                label="Master Out"
            />
        </g>
        <g transform="translate(80,100)">
            {#each device.audioPorts.filter(p => !p.isOutput) as port, i}
                <PortComponent
                    label="Input {i + 1}"
                    x={i * 50}
                    {port}
                />
            {/each}
        </g>
    {/if}
</Panel>
