<script lang="ts">
	import '../app.css';
	import { login, auth, read } from '../firebase';

	let clicked = false;
	// idk what data type firebase user is
	let signedInUser: any;

	// on login state change
	auth.onAuthStateChanged(async (user) => {
		if (user) {
			signedInUser = user;
			// don't immediately send to next page unless user clicked button
			if (!clicked) return;
			checkBoard();
		}
	});

	async function checkBoard() {
		// wait one second to make sure user is signed in
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// check whether user has a board assigned
		const boardName = await read('users/' + signedInUser.uid + '/board');

		if (boardName === 'null') {
			// no board assigned
			window.location.href = './new';
		} else {
			// already has a board
			window.location.href = './' + boardName;
		}
	}

	function clickLogin() {
		clicked = true;
		if (signedInUser) {
			checkBoard();
		} else {
			login();
		}
	}
</script>

<svelte:head>
	<title>Board</title>
</svelte:head>

<body>
	<p>Create your board and express your thoughts, notes, or anything else.</p>
	<button on:click={clickLogin}>Sign In to create a board</button>
	<p>or check out a <a href="./sample-board">sample board</a>!</p>
</body>

<style>
	p {
		font-size: 2.8em;
		text-shadow: 0 0 10px #000000bb;
	}

	button {
		font-size: 2.8em;
		padding: 1em 1.3em;
		border-radius: 50em;
		border: none;
		background-color: white;
		box-shadow: inset 0 0 10px #000000bb;
		text-shadow: 0 0 5px #00000044;
		cursor: pointer;
		margin: 1.5em 0;
		transition: transform 0.1s;
	}

	button:active {
		transform: scale(0.98);
	}

	a {
		color: #ffffff;
	}
</style>
