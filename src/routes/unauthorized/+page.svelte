<script lang="ts">
	import angrycat from '../../angrycat.gif';
	import '../../app.css';
</script>

<svelte:head>
	<title>Board | Unauthorized</title>
</svelte:head>

<body>
	<img src={angrycat} alt="Angry Cat GIF" />
	<a href="./">Go Back</a>
</body>

<style>
	img {
		border-radius: 1em;
		box-shadow: 0 0 0.6em #000000bb;
		width: max(45vh, 30vw);
	}

	a {
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: max(2.2em, 3vh);
		text-shadow: 0 0 0.3em #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
		margin-top: 0.5em;
	}
</style>
