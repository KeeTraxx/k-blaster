<script>
  import { group } from "d3";
  import Port from "../controls/PortComponent.svelte";
  import DigitalDisplay from "../controls/DigitalDisplay.svelte";
  import Panel from "../controls/Panel.svelte";
  import type { HostMidi } from "../lib/HostMidi";
  export let device: HostMidi;
  export let front: boolean;
  /* let physicalDevices = group(device.devices, d => d.groupId).values();
  beforeUpdate(() => {
    physicalDevices = group(device.devices, d => d.groupId).values();
  })*/
</script>

<Panel height={100} type="HostMidi" fill="#eee">
  {#if front}
    <text>{device.midiPorts.length}</text>
  {:else}
    <g transform="translate(5, 10)">
      {#each device.midiPorts as port, i}
        <g transform="translate({100 * i}, 0)">
          <DigitalDisplay fontSize="8" width={50} text={port.label} />
          <Port
            x={30}
            y={40}
            {port}
            label={port.isOutput ? 'source' : 'sink'}
          />
        </g>
      {/each}
    </g>
  {/if}
</Panel>
