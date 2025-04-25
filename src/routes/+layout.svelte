<script lang="ts">
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import '../app.css';
	import { isAdmin } from '$lib/state.svelte';
	let loading = $state(false);
	async function handleLogout() {
		loading = true;
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
			return;
		} finally {
			isAdmin.value = false;
			loading = false;
			return;
		}
	}

	let { children } = $props();
</script>

<svelte:head>
	<title>Moveverso</title>
	<meta name="google" value="notranslate" />
	<meta name="google" content="notranslate" />
</svelte:head>

{@render children()}

{#if isAdmin.value}
	<div class="fixed right-2 bottom-2">
		<button
			onclick={() => handleLogout()}
			class="{loading
				? 'pointer-events-none opacity-50'
				: ''} bg-accent cursor-pointer rounded-full p-3 drop-shadow-lg transition-transform hover:-translate-y-1"
		>
			<div class="text-secondary">Admin Log Out</div>
		</button>
	</div>
{/if}
