<script lang="ts">
	import { db } from '../firebase.js';
	import { onValue, ref } from 'firebase/database';
	import { onMount } from 'svelte';
	import '../app.css';

	// listen for changes to the database
	onMount(() => {
		const dbRef = ref(db, 'main');
		onValue(dbRef, (snapshot) => {
			const data = snapshot.val();
			const main = document.querySelector('#main');
			if (main) {
				main.innerHTML = data;
			}
		});
	});
</script>

<svelte:head>
	<title>Thoughts</title>
</svelte:head>

<body>
	<p id="main">hold on</p>
	<a href="./admin" id="admin-panel">Admin Panel</a>
</body>

<style>
	body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		min-width: 100vw;
		background-color: blueviolet;
	}

	#main {
		color: white;
		font-size: 2.8em;
		font-family: 'Inter', sans-serif;
		text-align: center;
		position: relative;
		text-shadow: 0 0 10px #000000bb;
		font-weight: 500;
	}

	#admin-panel {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 1.5em;
		text-shadow: 0 0 10px #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
	}
</style>
