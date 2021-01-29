<script>
  import Port from "../controls/PortComponent.svelte";
  import Panel from "../controls/Panel.svelte";
  import type { SpectrumAnalyzer } from "src/lib/SpectrumAnalyzer";
  import SpectrumDisplay from "../controls/SpectrumDisplay.svelte";
  export let device: SpectrumAnalyzer;
  export let front: boolean;
</script>

<Panel height={200} type="SpectrumAnalyzer" fill="#eee">
  {#if front}
    <SpectrumDisplay analyzerNode={device.analyzer} />
  {:else}
    <g transform="translate(5, 10)">
      {#each device.audioPorts as port, i}
        <g transform="translate({100 * i}, 0)">
          <Port
            x={30}
            y={40}
            {port}
            label={port.isOutput ? 'output' : 'input'}
          />
        </g>
      {/each}
    </g>
  {/if}
</Panel>
