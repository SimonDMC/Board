<script lang="ts">
	import '../../app.css';
	import { auth, read, createBoardDb } from '../../firebase';
	import { onMount } from 'svelte';

	onMount(async () => {
		// on login state change
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				// check whether user has a board assigned
				const boardName = await read('users/' + user.uid + '/board');
				if (boardName !== 'null') {
					// already has a board
					window.location.href = './' + boardName;
				}
			} else {
				// redirect to home page
				window.location.href = './';
			}
		});
	});

	async function createBoard() {
		// get input
		const input = document.getElementById('input') as HTMLInputElement;
		const boardName = input.value;
		console.log(boardName);

		// check if board name is valid
		if (boardName.length < 3) {
			displayNotification('Board name must be at least 3 characters long.');
			return;
		} else if (boardName.length > 20) {
			displayNotification('Board name must be at most 20 characters long.');
			return;
		} else if (!/^[a-zA-Z0-9-]+$/.test(boardName)) {
			displayNotification('Board name must only contain letters, numbers and dashes.');
			return;
		}

		// board name is valid, check if it already exists
		const legal = await read(`reserved/${boardName.toLowerCase()}`);
		if (legal) {
			displayNotification('Not allowed to use this board name.');
			return;
		}
		const taken = await read(`taken/${boardName.toLowerCase()}`);
		if (taken) {
			displayNotification('Board name is already taken.');
			return;
		}

		// all checks passed, create board
		displayNotification('Creating board...');
		await createBoardDb(boardName.toLowerCase());

		// wait 1 second to make sure board is created
		await new Promise((resolve) => setTimeout(resolve, 1000));
		window.location.href = './' + boardName;
	}

	async function displayNotification(text: string) {
		const notification = document.querySelector('.notif');
		if (notification) {
			notification.innerHTML = text;
			notification.classList.add('show');
			setTimeout(() => {
				notification.classList.remove('show');
			}, 3000);
		}
	}
</script>

<svelte:head>
	<title>Create Board</title>
</svelte:head>

<body>
	<p>Give your board a name!</p>
	<input type="text" placeholder="Board Name" id="input" />
	<button on:click={createBoard}>Continue</button>
	<p class="notif">This is a notification.</p>
</body>

<style>
	p {
		font-size: 3.5em;
		text-shadow: 0 0 0.15em #000000bb;
	}

	input {
		font-size: 3em;
		text-align: center;
		width: 12em;
		margin: 0.5em 0 1.5em 0;
		outline: none;
		border: none;
		border-bottom: 0.1em solid white;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		filter: drop-shadow(0 0 0.12em #000000bb);
	}

	input::placeholder {
		color: #ffffffbb;
	}

	button {
		font-size: 2.8em;
		padding: 0.7em 1em;
		border-radius: 50em;
		border: none;
		background-color: white;
		box-shadow: inset 0 0 0.2em #000000bb;
		text-shadow: 0 0 0.1em #00000044;
		cursor: pointer;
		transition: transform 0.1s;
	}

	button:active {
		transform: scale(0.98);
	}

	p.notif {
		height: 0;
		transform: translateY(0.6em);
		font-size: 3em;
		opacity: 0;
		transition: opacity 0.2s, transform 0.2s ease-out;
	}

	:global(p.notif.show) {
		transform: translateY(0.2em);
		opacity: 1;
	}
</style>
