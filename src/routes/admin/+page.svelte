<script lang="ts">
	import { login, logout, read, write, auth } from '../../firebase.js';
	import { onMount } from 'svelte';
	import '../../app.css';

	let inputText: string = '';

	onMount(async () => {
		// on login state change
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				// get whether user is admin
				const isAdmin = await read('users/' + user.uid + '/admin');
				if (isAdmin) {
					// if admin, show success indicator
					const loginButton = document.querySelector('#login');
					if (loginButton) {
						loginButton.classList.add('success');
					}
				} else {
					// if not admin, sign out and redirect to unauthorized page
					await auth.signOut();
					window.location.href = './unauthorized';
				}
			}
		});

		// write to db on input change
		const input = document.querySelector('#input') as HTMLInputElement;
		if (input) {
			input.addEventListener('input', (e: Event) => {
				if (
					(e.target as HTMLElement).innerHTML.substr(
						(e.target as HTMLElement).innerHTML.length - 4
					) != '<br>'
				) {
					inputText = (e.target as HTMLElement).innerHTML + '<br>';
					pasteHtmlAtCaret('<br>');
				}

				write('main', (e.target as HTMLElement).innerHTML);
			});

			// set input text to db value on load
			// disable before fetched
			input.disabled = true;
			input.classList.add('disabled');
			inputText = await read('main');
			input.innerHTML = inputText;
			// reenable
			input.disabled = false;
			input.classList.remove('disabled');
		}
	});

	function pasteHtmlAtCaret(html: any) {
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel!.rangeCount) {
				range = sel!.getRangeAt(0);
				range.deleteContents();

				// Range.createContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers (IE9, for one)
				var el = document.createElement('div');
				el.innerHTML = html;
				var frag = document.createDocumentFragment(),
					node,
					lastNode;
				while ((node = el.firstChild)) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel!.removeAllRanges();
					sel!.addRange(range);
				}
			}
		}
	}

	function checkEnterPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (document.querySelector('#input')) {
				pasteHtmlAtCaret('<br>');
			}
		}
	}
</script>

<svelte:head>
	<title>Thoughts | Admin Panel</title>
</svelte:head>

<body>
	<button id="login" on:click={login}>Log In</button>
	<button id="logout" on:click={logout}>Log Out</button>
	<div
		style={inputText == '' || inputText == '<br>' ? 'line-height: 60vh;' : ''}
		id="input"
		class={inputText.replace(/<br>/g, '') == '' ? 'empty' : ''}
		contenteditable
		bind:innerHTML={inputText}
		on:keydown={checkEnterPress}
	/>
</body>

<style>
	#login {
		margin-top: 8vh;
		background-color: white;
		color: black;
		border: none;
		outline: none;
		font-size: 3em;
		font-family: 'Inter', sans-serif;
		padding: 1.5% 3%;
		position: relative;
		border-radius: 100em;
		box-shadow: inset 0 0 10px #000000bb;
		cursor: pointer;
		transition: transform 0.1s, background-color 0.2s ease-in-out;
		font-weight: 500;
	}

	#logout {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
		border: none;
		outline: none;
		background-color: transparent;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 2em;
		text-shadow: 0 0 10px #000000bb;
		cursor: pointer;
		font-weight: 400;
	}

	:global(#login.success) {
		background-color: #ccffcc;
	}

	#login:active {
		transform: scale(0.98);
	}

	#input {
		margin-top: 8vh;
		background-color: white;
		color: black;
		border: none;
		outline: none;
		font-size: 2.3em;
		font-family: 'Inter', sans-serif;
		text-align: center;
		width: 60vw;
		height: 60vh;
		border-radius: 1em;
		box-shadow: inset 0 0 10px #000000bb;
		font-weight: 500;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	:global(#input *) {
		font-size: 2.3rem !important;
	}

	:global(#input.disabled) {
		background-color: #cccccc;
	}

	:global(#input.empty > :first-child) {
		display: none;
	}
</style>
