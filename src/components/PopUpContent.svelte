<script>
    export let popupMessage = 'Lorem ipsum dolor sit amet';

    import { getContext } from 'svelte';
    import PopUp from './PopUp.svelte';
    const { open } = getContext('simple-modal');
    const showPopup = () => open(PopUp, { message: popupMessage});
</script>

<button on:click={showPopup}>Project Flaws</button>