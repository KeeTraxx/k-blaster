<script>
  import {
    afterUpdate,
    beforeUpdate,
    createEventDispatcher,
    onMount,
  } from "svelte";

  import DigitalDisplay from "./DigitalDisplay.svelte";
  import SvgButton from "./SvgButton.svelte";

  export let x: number = 0;
  export let y: number = 0;
  export let items: Array<{ label: string; value: any }> = [];
  const dispatch = createEventDispatcher();
  let selectedIndex = 0;

  function next() {
    selectedIndex++;
    selectedIndex = selectedIndex % items.length;
    dispatch('select', items[selectedIndex]);
  }

  function previous() {
    selectedIndex--;
    if (selectedIndex < 0) {
      selectedIndex = items.length - 1;
    }
    selectedIndex = selectedIndex % items.length;
    dispatch('select', items[selectedIndex]);
  }

  onMount(() => {
    dispatch('select', items[selectedIndex]);
  });
</script>

<g transform="translate({x},{y})">
  <SvgButton text="◀" on:click={() => previous()} />
  <DigitalDisplay x={32} text={items[selectedIndex].label} />
  <SvgButton x={180} text="▶" on:click={() => next()} />
</g>
