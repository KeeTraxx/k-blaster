<script lang="ts">
    import Mixer from './Mixer/Mixer.svelte';
    const components = {
        'Mixer': Mixer
    }

    export let component;
    export let props = {};

    const c = components[component];
</script>

{#if c}
    <svelte:component this={c} {...props} />
{/if}
