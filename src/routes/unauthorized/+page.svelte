<script lang="ts">
	import angrycat from '../../angrycat.gif';
	import '../../app.css';
</script>

<svelte:head>
	<title>Thoughts | Unauthorized</title>
</svelte:head>

<body>
	<img src={angrycat} alt="Angry Cat GIF" />
	<a href="./">Go Back</a>
</body>

<style>
	img {
		border-radius: 1em;
		box-shadow: 0 0 10px #000000bb;
	}

	a {
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 2em;
		text-shadow: 0 0 10px #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
		margin-top: 0.5em;
	}
</style>
