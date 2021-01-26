<script lang="typescript">
  import "./TailwindCSS.svelte";
  // import Rack from "./rack-components/Rack.svelte";
  import {Rack as LibRack} from "./lib/Rack";
import type { Mixer } from "./lib/Mixer";
import type { HostAudio } from "./lib/HostAudio";
import type { Oscillator } from "./lib/Oscillator";
import RackComponent from "./rack-components/RackComponent.svelte";
import ZoomableSvg from "./rack-components/ZoomableSvg.svelte";

  let rack:LibRack;

  let audioContext: AudioContext;
  let initDone = false;



  window.addEventListener('keydown', init);
  window.addEventListener('click', init);

  async function init() {
    window.removeEventListener('keydown', init);
    window.removeEventListener('click', init);
    if (!initDone) {
      if (!audioContext) {
      audioContext = new AudioContext();
    }

    rack = new LibRack(audioContext);
    await rack.loadConfig([
      {id: 'hostaudio', type: 'HostAudio'},
      {id: 'mainMixer', type: 'Mixer', numInputs: 8, numOutputs: 2},
      {id: 'testosci', type: 'Oscillator', numFourierCoefficients: 10, oscillatorType: 'sine', outgoingAudioConnections: [{toDeviceId: 'mainMixer', fromAudioPortIndex: 0, toAudioPortIndex:0}]}
    ]);
      const hostaudio = rack.getDeviceById<HostAudio>('hostaudio');
      const mixer = rack.getDeviceById<Mixer>('mainMixer');
      const osci = rack.getDeviceById<Oscillator>('testosci');
      if (hostaudio.defaultAudioInputNode) {
        mixer.connectAudioOutput(mixer.audioOutputs[0], hostaudio, hostaudio.defaultAudioInputNode);
      }

      initDone = true;
    }
  }
</script>

{#if audioContext && initDone}
  {#if initDone}
  <ZoomableSvg>
    <RackComponent {rack} />
  </ZoomableSvg>
  {:else}
    <div>booting...</div>
  {/if}
{:else}
  <p>Press / Click any key to start</p>
{/if}
