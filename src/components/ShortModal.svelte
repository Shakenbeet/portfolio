<script>
    import Modal from 'svelte-simple-modal';
	import PopUpContent from './PopUpContent.svelte';

    export let msg = 'lorem ipsum dolor sit amet';
</script>

<Modal>
    <PopUpContent 
        popupMessage="{msg}"
        popupTitle="About"
        buttonText='Learn More'
    />
</Modal>