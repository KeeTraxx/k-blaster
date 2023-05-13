<script lang="ts">
    import Component from "./lib/Components/Component.svelte";
    import { View } from "./lib/Components/types.d";
    let view = View.FRONT;

    function k(event:KeyboardEvent) {
        if (event.key === 'Tab') {
            view = view === View.FRONT ? View.BACK : View.FRONT;
            event.preventDefault();
        }
    }
</script>

<svelte:window on:keydown={k} />

<main>
    hello
    <Component component='Mixer' props={{view}} />
</main>
