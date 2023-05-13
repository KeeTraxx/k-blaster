<script lang="ts">
    import Mixer from './Mixer/Mixer.svelte';
    const components = {
        'Mixer': Mixer
    }

    export let component;
    export let props = {};
    console.log(components);

    const c = components[component];
    console.log(c);
</script>

{#if c}
    <svelte:component this={c} {...props} />
{/if}
