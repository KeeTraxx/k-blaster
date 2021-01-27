<script>
  import { createEventDispatcher, onMount } from "svelte";

  import DigitalDisplay from "./DigitalDisplay.svelte";
  import SvgButton from "./SvgButton.svelte";

  export let x: number = 0;
  export let y: number = 0;
  export let width: number = 120;
  export let items: Array<{ label: string; value: any }> = [];
  export let selected: any;
  const dispatch = createEventDispatcher();
  let selectedIndex = 0;

  function next() {
    selectedIndex++;
    selectedIndex = selectedIndex % items.length;
    dispatch("select", items[selectedIndex]);
  }

  function previous() {
    selectedIndex--;
    if (selectedIndex < 0) {
      selectedIndex = items.length - 1;
    }
    selectedIndex = selectedIndex % items.length;
    dispatch("select", items[selectedIndex]);
  }

  onMount(() => {
    // dispatch('select', items[selectedIndex]);
    if (items) {
      selectedIndex = items.findIndex(({ value }) => value === selected);
      if (selectedIndex === -1) {
        selectedIndex = 0;
      }
    }
  });
</script>

<g transform="translate({x},{y})">
  <SvgButton text="◀" on:click={() => previous()} />
  <SvgButton x={width + 42} text="▶" on:click={() => next()} />
  <DigitalDisplay {width} x={22} text={items[selectedIndex].label} />
</g>
