<script>
  import {group} from "d3";
  import Port from "../controls/Port.svelte";
  import DigitalDisplay from "../controls/DigitalDisplay.svelte";
  import Panel from "../controls/Panel.svelte";
  import { beforeUpdate } from "svelte";
  import type { HostMidi } from "../lib/HostMidi";
  export let device:HostMidi;
  export let front:boolean;
  /* let physicalDevices = group(device.devices, d => d.groupId).values();
  beforeUpdate(() => {
    physicalDevices = group(device.devices, d => d.groupId).values();
  })*/
</script>

<Panel height={100} type="HostMidi" fill="#eee">
  {#if front}
  <text>{device.midiInputs}</text>
  {:else}
    <g transform="translate(5, 10)">
     
    </g>
  {/if}
</Panel>
