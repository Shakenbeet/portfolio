<script>
    export let popupMessage = 'Lorem ipsum dolor sit amet';
    export let popupTitle = 'Title';
    export let buttonText = 'Project Flaws';

    import { getContext } from 'svelte';
    import PopUp from './PopUp.svelte';
    const { open } = getContext('simple-modal');
    const showPopup = () => open(PopUp, { title: popupTitle, message: popupMessage});
</script>

<button on:click={showPopup}>{buttonText}</button>