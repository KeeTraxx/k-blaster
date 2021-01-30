<script lang="typescript">
  import "./TailwindCSS.svelte";
  // import Rack from "./rack-components/Rack.svelte";
  import Rack from "./lib/Rack";
  import type { Mixer } from "./lib/Mixer";
  import type { HostAudio } from "./lib/HostAudio";
  import type { Oscillator } from "./lib/Oscillator";
  import RackComponent from "./rack-components/RackComponent.svelte";
  import ZoomableSvg from "./rack-components/ZoomableSvg.svelte";
  import { connect } from "./lib/PortUtil";

  let rack: Rack;

  let audioContext: AudioContext;
  let initDone = false;

  window.addEventListener("keydown", init);
  window.addEventListener("click", init);

  async function init() {
    window.removeEventListener("keydown", init);
    window.removeEventListener("click", init);
    if (!initDone) {
      if (!audioContext) {
        audioContext = new AudioContext();
      }

      rack = new Rack(audioContext);
      await rack.loadConfig([
        { id: "hostaudio", type: "HostAudio" },
        { id: "hostmidi", type: "HostMidi" },
        {
          id: "mainMixer",
          type: "Mixer",
          numInputs: 8,
          numOutputs: 2,
          outgoingAudioConnections: [
            {
              toDeviceId: "spectrumAnalyzer",
              fromAudioPortIndex: 8,
              toAudioPortIndex: 0,
            },
          ],
        },
        { id: "spectrumAnalyzer", type: "SpectrumAnalyzer" },
        {
          id: "testosci",
          type: "Oscillator",
          numFourierCoefficients: 10,
          oscillatorType: "sine",
          outgoingAudioConnections: [
            {
              toDeviceId: "mainMixer",
              fromAudioPortIndex: 0,
              toAudioPortIndex: 0,
            },
          ],
        },
        {
          id: "virtualkeyboard",
          type: "VirtualKeyboard",
          outgoingMidiConnections: [
            {
              toDeviceId: "testosci",
              fromMidiPortIndex: 1,
              toMidiPortIndex: 0,
            },
          ],
        },
      ]);
      const hostaudio = rack.getDeviceById<HostAudio>("hostaudio");
      const mixer = rack.getDeviceById("mainMixer");
      const spectrumAnalyzer = rack.getDeviceById("spectrumAnalyzer");
      const masterOut = mixer.audioPorts.find((d) => d.isOutput);
      /*if (masterOut && spectrumAnalyzer.audioPorts[0]) {
        connect(masterOut, spectrumAnalyzer.audioPorts[0]);
      }*/
      if (spectrumAnalyzer.audioPorts[1] && hostaudio.defaultAudioPort) {
        connect(spectrumAnalyzer.audioPorts[1], hostaudio.defaultAudioPort);
      }

      initDone = true;
    }
  }
</script>

{#if audioContext && initDone}
  <aside>
    <h1>HELP</h1>
    <dl>
      <dt>[tab]</dt>
      <dd>switch to back panel</dd>
    </dl>
  </aside>
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

<style>
  aside {
    position: fixed;
    top: 1em;
    right: 1em;
    padding: 0.5em;
    border-radius: 0.5em;
    opacity: 0.7;
    background: rgba(0, 0, 0, 0.3);
  }
  dt,
  dd {
    display: inline-block;
    margin: 0.1em 0.5em;
  }

  dt {
    text-align: right;
  }
</style>
