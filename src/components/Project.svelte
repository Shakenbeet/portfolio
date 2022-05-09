<script>
    export let projectName = 'Github Project';
    export let projectImage = 'VC.png';
    export let projectDesc = 'Description of this Project';
    export let projectLink = '';
    export let buttonText = 'View on Github';
</script>

<style>
    img {
        width: 250px;
        height: 250px;
    }
</style>

<div class='Project'>
    <h2>{projectName}</h2>
    <img src='{projectImage}' alt="image of {projectName}'s logo"/>
    <p>{projectDesc}</p>
    <a href='{projectLink}'>
        <button>{buttonText}</button>
    </a>
</div>