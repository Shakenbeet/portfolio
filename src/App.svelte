<script>
	import Footer from './components/Footer.svelte';
	import Project from './components/Project.svelte';
	import FlawsModal from './components/FlawsModal.svelte';

	export let name;
</script>

<main>
	<h1>Luke Gobin</h1>
	<p>Welcome to my website</p>
	<h1>Featured Project:</h1>
	<Project projectName="Visual Code" projectDesc="Visual Code is an application to help new programmers write C# code with ease." projectImage="VC.png" projectLink="https://github.com/Shakenbeet/VisualCode"/>
	<FlawsModal msg="Visual Code is a major violator of the D.R.Y principle of software development, hence why it is over 1,000 lines of code. These violations also cause difficulties when patching and updating the application, which was why development was discontinued."/>
	
	<h1>Other Projects:</h1>
	<Project projectName="Image Resize" projectDesc="Image Resize was made with the purpose of resizing multiple images quickly." projectImage="ImageResize.png" projectLink="https://github.com/Shakenbeet/ImageResizeTool"/>
	<FlawsModal msg="Image Resize replaces images it resizes, permanently deleting the original file. I have fallen victim to my own project's flaws many times, yet I still too lazy to fix it :)" />

	<Project projectName="Nova Storefront" projectDesc="My most successful application to date, Nova was a psuedo game-storefront." projectImage="Nova.png" buttonText="Source not Available"/>
	<FlawsModal msg="Nova was written in raw HTML and preformance was terrible. A Desktop version was once available, it was a WPF app that used Cefsharp to connect to the Nova website. Games were difficult to download and play because of how challenging it was to use the Nova client." />
	<Footer />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>