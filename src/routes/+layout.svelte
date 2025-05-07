<script lang="ts">
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import '../app.css';
	import { isAdmin, homepage, loading } from '$lib/state.svelte';
	import moveverso from '$lib/assets/moveverso.png';
	let loadingLocal = $state(false);
	async function handleLogout() {
		loadingLocal = true;
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
			return;
		} finally {
			isAdmin.value = false;
			loadingLocal = false;
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

<div class="flex w-full flex-col items-center gap-15">
	<div class="absolute -z-1 h-[400px] w-full bg-gradient-to-b from-black to-black/0"></div>
	<a
		href="/"
		class="relative mt-10 transition-all {homepage.value
			? 'w-[400px] lg:w-[550px]'
			: 'w-[200px] lg:w-[300px]'}"
	>
		<img src={moveverso} class="drop-shadow-accent/50 drop-shadow-[0_0_20px]" alt="" />
	</a>
	{@render children()}
	<div
		class="static bottom-0 h-[150px] w-full bg-gradient-to-t from-black to-black/0 {loading.value ||
		loadingLocal
			? 'hidden'
			: ''}"
	></div>
</div>

{#if isAdmin.value}
	<div class="fixed right-2 bottom-2">
		<button
			onclick={() => handleLogout()}
			class="{loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent cursor-pointer rounded-full p-3 drop-shadow-lg transition-transform hover:-translate-y-1"
		>
			<div class="text-secondary">Admin Log Out</div>
		</button>
	</div>
{/if}
