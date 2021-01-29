<script context="module">
  import type { SvelteComponentDev } from "svelte/internal";
  import HostAudioComponent from "./HostAudioComponent.svelte";
  import HostMidiComponent from "./HostMidiComponent.svelte";

  const deviceMap: Map<
    string,
    { component: typeof SvelteComponentDev; heightUnits: number }
  > = new Map();

  deviceMap.set("HostAudio", { component: HostAudioComponent, heightUnits: 1 });
  deviceMap.set("HostMidi", { component: HostMidiComponent, heightUnits: 1 });
  deviceMap.set("Mixer", { component: MixerComponent, heightUnits: 2 });
  deviceMap.set("Oscillator", { component: OscillatorComponent, heightUnits: 2 });
</script>

<script>
  import type Rack from "../lib/Rack";
  import Shaders from "./Shaders.svelte";
  import {
    cables,
    startPort,
    floatingCable,
    clientPos,
  } from "../store/CableStore";
  import Cable from "./Cable.svelte";
  import { svgPos } from "../Util";
  import log from "../helper/Logger";
  import MixerComponent from "./MixerComponent.svelte";
import OscillatorComponent from "./OscillatorComponent.svelte";
  export let rack: Rack;
  let front: boolean = true;

  let y = 0;

  let svelteComponents = rack.devices.map((device) => {
    const type = device.constructor.name;
    const componentInfo = deviceMap.get(type);
    if (componentInfo) {
      const dat = {
        type,
        svelte: componentInfo.component,
        device,
        y,
      };
      y += componentInfo.heightUnits * 100;
      return dat;
    } else {
      const dat = {
        type,
        svelte: undefined,
        y,
      };
      y += 200;
      return dat;
    }
  });

  function toggleFront(e: KeyboardEvent) {
    if (e.key === "Tab") {
      front = !front;
      e.preventDefault();
      e.stopPropagation();
    }
  }

  let mouseMoveListener = (ev: MouseEvent) => {
    $clientPos = { x: ev.clientX, y: ev.clientY };
  };

  let touchMoveListener = (ev: TouchEvent) => {
    if (ev.changedTouches.length === 1) {
      const touch = ev.changedTouches[0];
      $clientPos = { x: touch.clientX, y: touch.clientY };
    }
  };

  startPort.subscribe((port) => {
    if (port !== undefined && port.element) {
      window.addEventListener("mousemove", mouseMoveListener);
      window.addEventListener("touchmove", touchMoveListener);
    } else {
      window.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("touchmove", touchMoveListener);
    }
  });

  cables.subscribe(cab => {
    // log.info('cables', cab);
  })
</script>

<svelte:window on:keydown={toggleFront} />
<Shaders />
{#each svelteComponents as comp}
  <g transform="translate(0,{comp.y})">
    {#if comp.svelte}
      <svelte:component this={comp.svelte} device={comp.device} {front} />
    {:else}
      <text>Not found {comp.type}</text>
    {/if}
  </g>
{/each}
{#if !front}
  <g class="cables">
    {#if $cables}
      {#each $cables as cable}
        <Cable {...cable} />
      {/each}
    {/if}
    {#if $floatingCable}
      <Cable {...$floatingCable} />
    {/if}
  </g>
{/if}
