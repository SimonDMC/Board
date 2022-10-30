<script lang="ts">
	import { page } from '$app/stores';
	import { db, read } from '../../firebase';
	import { onValue, ref } from 'firebase/database';
	import { onMount } from 'svelte';
	import '../../app.css';

	const dir = $page.params.slug.toLowerCase();

	onMount(async () => {
		// check if the page exists
		let valid: boolean;

		try {
			valid = (await read(`taken/${dir}`)) as boolean;
		} catch (e) {
			window.location.href = '../404';
			return;
		}

		if (!valid) {
			window.location.href = '../404';
		}

		// listen for changes to the database
		const dbRef = ref(db, `boards/${dir}`);
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
	<title>{`Board | ${dir}`}</title>
</svelte:head>

<body>
	<p id="main">hold on</p>
	<a href={`./${dir}/admin`} id="admin-panel">Admin Panel</a>
	<a href="../" class="home">Home</a>
</body>

<style>
	body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100vw;
		background-color: blueviolet;
	}

	#main {
		color: white;
		font-size: 2.8em;
		font-family: 'Inter', sans-serif;
		text-align: center;
		position: relative;
		text-shadow: 0 0 0.2em #000000bb;
		font-weight: 500;
		word-break: break-word;
		overflow-y: scroll;
		/* hide scrollbar */
		-ms-overflow-style: none;
		scrollbar-width: none;
		margin: max(1em, 4.5vh) 0;
	}

	#main::-webkit-scrollbar {
		display: none;
	}

	#admin-panel {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: max(1.5em, 2.5vh);
		text-shadow: 0 0 0.3em #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
	}

	.home {
		position: absolute;
		top: 0.5em;
		left: 0.5em;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: max(1.5em, 2.5vh);
		text-shadow: 0 0 0.3em #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
	}
</style>
