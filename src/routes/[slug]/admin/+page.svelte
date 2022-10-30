<script lang="ts">
	import { login, logout, read, write, auth } from '../../../firebase.js';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pasteHtmlAtCaret } from '../../../utils';
	import '../../../app.css';

	const dir = $page.params.slug.toLowerCase();

	let inputText: string = '';

	onMount(async () => {
		const input = document.querySelector('#input') as HTMLElement;
		input.classList.add('loading');

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

		// on login state change
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				// get whether user has permission to write
				const hasPermission =
					(await read('users/' + user.uid + '/admin')) ||
					(await read('users/' + user.uid + '/board')) == dir;
				if (hasPermission) {
					// if user has write permission, show success indicator
					const loginButton = document.querySelector('#login');
					if (loginButton) {
						loginButton.classList.add('success');
						loginButton.innerHTML = 'Log Out';
					}
				} else {
					// if no perms, sign out and redirect to unauthorized page
					await auth.signOut();
					window.location.href = '../unauthorized';
				}
			}
		});

		// write to db on input change
		if (input) {
			/* due to how newlines work in HTML, having one <br> is not enough to go to the next line
			so a check happens to see if no new line at caret, if so paste one */
			input.addEventListener('input', (e: Event) => {
				if (
					(e.target as HTMLElement).innerHTML.substr(
						(e.target as HTMLElement).innerHTML.length - 4
					) != '<br>'
				) {
					inputText = (e.target as HTMLElement).innerHTML + '<br>';
					pasteHtmlAtCaret('<br>');
				}

				write(`boards/${dir}`, (e.target as HTMLElement).innerHTML);
			});

			inputText = await read(`boards/${dir}`);
			input.innerHTML = inputText;
			input.classList.remove('loading');

			// enable typing and disable the loading indicator
			input.contentEditable = 'true';
		}

		// add editor paste listener
		input.addEventListener('paste', (e: ClipboardEvent) => {
			e.preventDefault();
			const text = e.clipboardData?.getData('text/plain');
			document.execCommand('insertHTML', false, text);
		});
	});

	function checkEnterPress(e: KeyboardEvent) {
		/* in order to not have div break into different html elements every
		enter is consumer, cancelled and replaced with a <br> */
		if (e.key === 'Enter') {
			e.preventDefault();
			if (document.querySelector('#input')) {
				pasteHtmlAtCaret('<br>');
			}
		}
	}

	function toggleLogin() {
		const loginButton = document.querySelector('#login');
		if (loginButton) {
			if (loginButton.classList.contains('success')) {
				logout();
				window.location.href = '../';
			} else {
				login();
			}
		}
	}

	async function copyLink(e: Event) {
		navigator.clipboard.writeText(`https://board.simondmc.com/${dir}`);
		(e.target as HTMLElement).innerHTML = 'Copied!';
		setTimeout(() => {
			(e.target as HTMLElement).innerHTML = 'Share Link';
		}, 1000);
	}
</script>

<svelte:head>
	<title>Board | Admin Panel</title>
</svelte:head>

<body>
	<button id="login" on:click={toggleLogin}>Log In</button>
	<div class="wrapper">
		<div
			style={inputText == '' || inputText == '<br>' ? 'line-height: 60vh;' : ''}
			id="input"
			class={inputText.replace(/<br>/g, '') == '' ? 'empty' : ''}
			contenteditable="false"
			bind:innerHTML={inputText}
			on:keydown={checkEnterPress}
		/>
	</div>
	<button class="share" on:click={copyLink}>Share Link</button>
	<a href="./" class="back">Back</a>
</body>

<style>
	#login {
		background-color: white;
		color: black;
		border: none;
		outline: none;
		font-size: 3em;
		font-family: 'Inter', sans-serif;
		padding: 0.6em 1.2em;
		position: relative;
		border-radius: 100em;
		box-shadow: inset 0 0 0.2em #000000bb;
		cursor: pointer;
		transition: transform 0.1s, background-color 0.2s ease-in-out;
		font-weight: 500;
	}

	:global(#login.success) {
		background-color: #ccffcc;
	}

	#login:active {
		transform: scale(0.98);
	}

	#input {
		color: black;
		border: none;
		outline: none;
		font-size: 2.3em;
		font-family: 'Inter', sans-serif;
		text-align: center;
		font-weight: 500;
		position: relative;
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
		min-height: 100%;
		padding: 0.2em 0.5em;
	}

	.wrapper {
		margin-top: 8vh;
		width: min(90vw, 125vh);
		height: 60vh;
		overflow-y: scroll;
		background-color: white;
		border-radius: 2.3em;
		box-shadow: inset 0 0 0.6em #000000bb;
		/* hide scrollbar */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.wrapper::-webkit-scrollbar {
		display: none;
	}

	:global(#input.loading) {
		background-color: #cccccc;
	}

	:global(#input.empty > :first-child) {
		display: none;
	}

	.share {
		border: none;
		outline: none;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: max(2em, 3vh);
		text-shadow: 0 0 0.3em #000000bb;
		cursor: pointer;
		font-weight: 400;
		position: absolute;
		bottom: 0.3em;
		transition: scale 0.1s;
	}

	.share:hover {
		scale: 1.02;
	}

	a.back {
		position: absolute;
		top: 0.5em;
		left: 0.5em;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: max(1.5em, 2.6vh);
		text-shadow: 0 0 0.3em #000000bb;
		cursor: pointer;
		text-decoration: none;
		font-weight: 400;
	}
</style>
