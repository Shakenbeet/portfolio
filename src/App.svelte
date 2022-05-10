<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Project from './components/Project.svelte';
	import ShortModal from './components/ShortModal.svelte';
</script>

<main>
	<Header />
	<div class='banner'>
		<h1 class="title">Luke Gobin</h1>
		<p>an endless journey of spaghetti code</p>
	</div>

	<div class='content'>
		<h1 id="about">About Me</h1>
		<p class="textblock">My name is Luke Gobin and I'm from Houston. I'm proficient in C#, C++, and HTML but I am always open to learn new languages.</p>
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src="https://avatars.githubusercontent.com/u/68769498?v=4" style="width: 350px; height: 350px;" alt="My Profile Image from Github"/>

		<h3>When Did You Start Programming?</h3>
		<h4>I have no certain date of when I started programming, I think I started programming around 2016 and 2017</h4>

		<h3>How Did You Learn How to Program?</h3>
		<h4>I learned how to program using a HTML book I got for christmas one year, for all the other languages, I used W3Schools and StackOverflow</h4>
		<h4>I started programming with Scratch.mit.edu, a block-coding website, to make fun little games and animations.</h4>
		<h4>However, I started to realise the limitations of Scratch, so I started to learn HTML and C# using books and W3Schools</h4>

		<h3>What Are You Doing Now?</h3>
		<h4>Currently I am exploring the programming world, but my main interest is in game engines such as Unity.</h4>

		<h3>What Do You Want to Do in The Future?</h3>
		<h4>In the future I want to work in the game development industry, as a kid I always wanted to build games and now I am trying to make that dream a reality.</h4>

		<h1 id="work">My Applications</h1>
		<h2>Featured Project</h2>
		<Project projectName="Visual Code" projectDesc="Visual Code is an application to help new programmers write C# code with ease." projectImage="VC.png" projectLink="https://github.com/Shakenbeet/VisualCode"/>
		<ShortModal msg="When I started to learn how to program I always wanted to try and get friends and family to learn aswell, however programming proved difficult for them. So I created VisualCode, which use dropboxes and simple UI to help the end user create simple C# console apps"/>

		<h2>Other Projects</h2>
		<Project projectName="Image Resize" projectDesc="Image Resize was made with the purpose of resizing multiple images quickly." projectImage="ImageResize.png" projectLink="https://github.com/Shakenbeet/ImageResizeTool"/>
		<ShortModal msg="In my school's yearbook department, my peers would always ask me to resize their images in Photoshop. Photoshop is very slow and these tasks were very tedious, so I created ImageResize so my peers and I can easily and quickly resize several images" />

		<Project projectName="Nova Storefront" projectDesc="My most successful application to date, Nova was a psuedo game-storefront." projectImage="nova.png" buttonText="Source not Available"/>
		<ShortModal msg="My schoolmates wanted to play my games, so I created Nova as a launcher for all my games. The website was made with raw HTML and the client was made in WPF" />

		<h1 id="games">My Games</h1>
		<h2>Featured Game</h2>
		<Project projectName="Snake Hunter" projectDesc="Simple game where you shoot the snake for points, made with java in LibGDX" projectImage="snake.png" buttonText="Play On Web" projectLink="https://shakenbeet.github.io/SnakeHunter/"/>
		<a href="https://shakenbeet.github.io/SnakeHunter/">
			<button>View on Github</button>
		</a>
		
		<h2>Other Games</h2>
		<Project projectName="Lucy Simulator" projectDesc="Lucy Simulator is a small cult-classic 'franchise' of pet simulators where you take care of a dog named Lucy" projectImage="lucy.png" buttonText="Download Lucy Simulator 2019 (Nova)" projectLink="http://nova-storefront.glitch.me/games/Lucy.html" />
		<ShortModal msg="Lucy Simulator was a game I made on scratch in 2017 about my Grandma's dog, Lucy. The game was very popular among my friends and many unofficial spin-offs were made. Eventually I created an official sequel in Unity during 2019 for the Nova Launcher." />

		<Project projectName="Flappuccino" projectDesc="Flappuccino is a Unity remake of Polymars' game of the same name" projectImage="flap.png" buttonText="Download Flappuccino (Nova)" projectLink="http://nova-storefront.glitch.me/games/Flap.html"/>
		<a href="https://github.com/Shakenbeet/FlappuccinoUnity">
			<button>View on Github</button>
		</a>

		<Project projectName="Unreal CubeBlaster" projectDesc="Explode cubes with your exceptionally weird rifle or ride them, but at all costs don't get knocked off the platform!" projectImage="blast.png" buttonText="Download Unreal CubeBlaster (GameJolt)" projectLink="https://gamejolt.com/games/CubeBlaster/469015" />

		<Project projectName="Hobbit VideoGame" projectDesc="A 'game' made for a school project about The Hobbit" projectImage="hobbit.png" buttonText="Download The Hobbit (Nova)" projectLink="http://nova-storefront.glitch.me/games/Hobbit.html" />
		<a href="https://gamejolt.com/games/thehobbitvideogame/552429">
			<button>Alternate Download (GameJolt)</button>
		</a>

		<Footer />
	</div>
</main>

<style>
	main {
		text-align: center;
		/* padding: 2em; */
		max-width: 240px;
		/* margin: 0 auto; */
		overflow-x: hidden;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h2 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	h3 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	.title {
		color: white;
	}

	.banner {
		padding: 60px;
		padding-bottom: 80px;
		font-size: 30px;
		background-color: #ff3e00;
		color: white;
	}

	.content {
		padding: 20px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
