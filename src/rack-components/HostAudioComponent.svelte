<script>
  import {group} from "d3";
  import Port from "../controls/PortComponent.svelte";
  import DigitalDisplay from "../controls/DigitalDisplay.svelte";
  import Panel from "../controls/Panel.svelte";
  import type { HostAudio } from "../lib/HostAudio";
  import { beforeUpdate } from "svelte";
  export let device:HostAudio;
  export let front:boolean;
  let physicalDevices = group(device.audioPorts, d => d.description).values();
  beforeUpdate(() => {
    physicalDevices = group(device.audioPorts, d => d.description).values();
  });
</script>

<Panel height={100} type="HostAudio" fill="#eee">
  {#if front}
      <text y=20>front {[...physicalDevices].length}</text>
  {:else}
    <g transform="translate(5, 10)">
      {#each [...physicalDevices] as dev, k}
        <g transform="translate({100*k}, 0)">
        <DigitalDisplay fontSize="8" width={50} text={[...dev][0].label} />
        <g transform="translate(10,40)">
          {#each [...dev.values()].filter(d => d.isOutput) as port, i}
            <Port x={i*20} {port} label="🎤" />
          {/each}
        </g>
        <g transform="translate(10,60)">
          {#each [...dev.values()].filter(d => !d.isOutput) as port, i}
            <Port x={i*20} {port} label="🕪" />
          {/each}
        </g>
      </g>
      {/each}
    </g>
  {/if}
</Panel>
