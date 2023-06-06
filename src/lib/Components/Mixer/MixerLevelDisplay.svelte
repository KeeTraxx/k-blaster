<script lang="ts">
    import {  scaleLinear, sum } from "d3";
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    export let audioContext: AudioContext;
    export let audioNode: AudioNode;

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
    export let fftSize = 32;
    export let minDecibels = -50;
    export let maxDecibels = -20;

    export let smoothing = true;

    const scale = scaleLinear().domain([0, 60]);

    let analyzer = audioContext.createAnalyser();
    analyzer.smoothingTimeConstant = 0.9;
    analyzer.fftSize = fftSize;
    analyzer.minDecibels = minDecibels;
    analyzer.maxDecibels = maxDecibels;
    audioNode.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const timeDomainData = new Uint8Array(bufferLength);
    let rect: DOMRect;

    let ctx: CanvasRenderingContext2D;
    let gradient: CanvasGradient;

    let volume = 0;

    function loop() {
        analyzer.getByteTimeDomainData(timeDomainData);
        if (!canvas) {
            return;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);
        const currentVolume = Math.sqrt(sum(timeDomainData.map(d => d*d)));

        if (currentVolume >= volume) {
            volume = currentVolume;
        } else {
            if (smoothing) {
                volume -= 1.5;
            } else {
                volume = currentVolume;
            }
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, scale(volume), 10, rect.height);

        window.requestAnimationFrame(loop);
    }

    onMount(() => {
        rect = canvas.getBoundingClientRect();
        ctx = canvas.getContext("2d");
        gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
        gradient.addColorStop(0, "green");
        gradient.addColorStop(0.5, "yellow");
        gradient.addColorStop(1, "red");
        scale.range([rect.height, 0]);
        loop();
    });

    onDestroy(() => {
        if (!audioNode) {
            return;
        }

        audioNode.disconnect(analyzer);
    });
</script>

<foreignObject width="100" height="250">
    <canvas bind:this={canvas} width="100" height="250" /></foreignObject
>
