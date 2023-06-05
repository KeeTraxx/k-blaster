<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    let canvas : HTMLCanvasElement;
    export let audioContext : AudioContext;
    export let audioNode : AudioNode;

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
    export let fftSize = 2048;
    export let minDecibels = -50;
    export let maxDecibels = -10;

    onMount(() => {
        loop();
    });

    let analyzer = audioContext.createAnalyser();
    analyzer.fftSize = fftSize;
    analyzer.minDecibels = minDecibels;
    analyzer.maxDecibels = maxDecibels;
    audioNode.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    const timeDomainData =  new Uint8Array(bufferLength);


    function loop() {
        analyzer.getByteFrequencyData(frequencyData);
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (frequencyData.some(d => d > 0)) {
            console.log(frequencyData);
        }
        
        window.requestAnimationFrame(loop);
    }

    
    onDestroy(() => {
        if (!audioNode) {
            return;
        }
    
        audioNode.disconnect(analyzer);
    });


</script>

<foreignObject width=100 height=100>
    <canvas bind:this={canvas}>
</foreignObject>

