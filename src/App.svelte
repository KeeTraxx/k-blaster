<script lang="typescript">
  import "./TailwindCSS.svelte";
  import Rack from "./rack-components/Rack.svelte";
  import configuration from "./defaultRack.json";
  import WebMidi from "webmidi";

  let audioContext: AudioContext;
  function init(e:Event) {
    if (!audioContext) {
      WebMidi.enable(err => err && console.log('Error initializing MIDI'), true);
      audioContext = new AudioContext();
      e.preventDefault();
      e.stopPropagation();
    }
  }
</script>

<svelte:window on:keydown={(e) => init(e)} />

{#if audioContext}
  <Rack {audioContext} {configuration} />
{:else}
  <div on:click={(e) => init(e)}>
    no audiocontext
  </div>
{/if}
