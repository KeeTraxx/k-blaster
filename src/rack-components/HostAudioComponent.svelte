<script>
  import {group} from "d3";
  import Port from "../controls/Port.svelte";
  import DigitalDisplay from "../controls/DigitalDisplay.svelte";
  import Panel from "../controls/Panel.svelte";
  import type { HostAudio } from "../lib/HostAudio";
  import { beforeUpdate } from "svelte";
  export let device:HostAudio;
  export let front:boolean;
  let physicalDevices = group(device.devices, d => d.groupId).values();
  beforeUpdate(() => {
    physicalDevices = group(device.devices, d => d.groupId).values();
  })
</script>

<Panel height={100} type="HostAudio" fill="#eee">
  <circle r=10 />
  {#if front}
      <text y=20>front {[...physicalDevices].length}</text>
  {:else}
    <g transform="translate(5, 10)">
      {#each [...physicalDevices] as dev, k}
        <g transform="translate({100*k}, 0)">
        <DigitalDisplay fontSize="8" width={50} text={[...dev][0].label} />
        <g transform="translate(10,40)">
          {#each [...dev.values()].filter(d => d.kind === 'audiooutput') as port, i}
            <Port {device} x={i*20} isOutput={false} node={device.getAudioInputNodeById(port.deviceId)} type="audio" label="o" />
          {/each}
        </g>
        <g transform="translate(10,60)">
          {#each [...dev.values()].filter(d => d.kind === 'audioinput') as port, i}
            <Port {device} x={i*20} isOutput={true} node={device.getAudioOutputNodeById(port.deviceId)} type="audio" label="i" />
          {/each}
        </g>
      </g>
      {/each}
    </g>
  {/if}
</Panel>
