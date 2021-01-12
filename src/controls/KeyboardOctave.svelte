<script>
  import type { MidiReceiver } from "src/lib/MidiReceiver";
  import { MIDI_COMMANDS } from "../Util";

  export let x: number = 0;
  export let y: number = 0;
  export let midiReceiver: MidiReceiver;
  export let octave = 4;
  export let channel = 0;

  function noteon(note: number) {
    const e = {
      ...new CustomEvent<WebMidi.MIDIMessageEvent>("midimessage"),
      data: new Uint8Array([(MIDI_COMMANDS.noteon << 4) | channel, note, 100]),
      receivedTime: 0,
    };
    midiReceiver.emit("midimessage", e);
  }

  function noteoff(note: number) {
    const e = {
      ...new CustomEvent<WebMidi.MIDIMessageEvent>("midimessage"),
      data: new Uint8Array([(MIDI_COMMANDS.noteoff << 4) | channel, note, 100]),
      receivedTime: 0,
    };
    midiReceiver.emit("midimessage", e);
  }

  const activeTouches = new Map<number, number>();

  function touchmove(e: TouchEvent) {
    [...e.changedTouches].forEach((t) => {
      const noteEl = document.elementFromPoint(t.clientX, t.clientY);
      if (noteEl === null) return;
      const note = parseInt(
        noteEl.attributes.getNamedItem("data-note")?.value || "0"
      );
      const touchId = t.identifier;
      if (activeTouches.has(touchId)) {
        // old touch
        const oldNote = activeTouches.get(touchId);
        if (oldNote !== undefined && oldNote !== note) {
          noteoff(oldNote);
          // change note
          noteon(note);
        }
        activeTouches.set(touchId, note);
      } else {
        // new touch
        noteon(note);
        activeTouches.set(touchId, note);
      }
    });
  }

  function touchend() {
    [...activeTouches.values()].forEach((n) => noteoff(n));
  }
</script>

<style>
  .white {
    fill: white;
    stroke: black;
  }

  .black {
    fill: black;
    stroke: black;
  }
</style>

<g
  transform="translate({x},{y})"
  on:touchend|preventDefault={() => touchend()}
  on:touchmove|preventDefault|stopPropagation={(e) => touchmove(e)}
  on:touchstart|preventDefault|stopPropagation={(e) => touchmove(e)}>
  <text>{octave}</text>
  <g class="white">
    {#each [0, 2, 4, 5, 7, 9, 11] as n, i}
      <rect
        data-note={n + octave * 12}
        on:mousedown|preventDefault|stopPropagation={() => noteon(n + octave * 12)}
        on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(n + octave * 12)}
        on:mouseup|preventDefault|stopPropagation={() => noteoff(n + octave * 12)}
        on:mouseleave|preventDefault|stopPropagation={() => noteoff(n + octave * 12)}
        x={i * 23}
        width="23"
        height="120" />
    {/each}
  </g>
  <!--  Black keys (overlap with the white keys)  -->
  <g class="black">
    <rect
      on:mousedown|preventDefault|stopPropagation={() => noteon(1 + octave * 12)}
      on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(1 + octave * 12)}
      on:mouseup|preventDefault|stopPropagation={() => noteoff(1 + octave * 12)}
      on:mouseleave|preventDefault|stopPropagation={() => noteoff(1 + octave * 12)}
      x="14.33333"
      y="0"
      width="13"
      height="80" />
    <rect
      on:mousedown|preventDefault|stopPropagation={() => noteon(3 + octave * 12)}
      on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(3 + octave * 12)}
      on:mouseup|preventDefault|stopPropagation={() => noteoff(3 + octave * 12)}
      on:mouseleave|preventDefault|stopPropagation={() => noteoff(3 + octave * 12)}
      x="41.66666"
      y="0"
      width="13"
      height="80" />
    <rect
      x="82.25"
      y="0"
      width="13"
      height="80"
      on:mousedown|preventDefault|stopPropagation={() => noteon(6 + octave * 12)}
      on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(6+ octave * 12)}
      on:mouseup|preventDefault|stopPropagation={() => noteoff(6 + octave * 12)}
      on:mouseleave|preventDefault|stopPropagation={() => noteoff(6 + octave * 12)} />
    <rect
      x="108.25"
      y="0"
      width="13"
      height="80"
      on:mousedown|preventDefault|stopPropagation={() => noteon(8 + octave * 12)}
      on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(8 + octave * 12)}
      on:mouseup|preventDefault|stopPropagation={() => noteoff(8 + octave * 12)}
      on:mouseleave|preventDefault|stopPropagation={() => noteoff(8 + octave * 12)} />
    <rect
      x="134.75"
      y="0"
      width="13"
      height="80"
      on:mousedown|preventDefault|stopPropagation={() => noteon(10 + octave * 12)}
      on:mouseenter|preventDefault|stopPropagation={(e) => e.buttons === 1 && noteon(10 + octave * 12)}
      on:mouseup|preventDefault|stopPropagation={() => noteoff(10 + octave * 12)}
      on:mouseleave|preventDefault|stopPropagation={() => noteoff(10 + octave * 12)} />
  </g>
</g>
