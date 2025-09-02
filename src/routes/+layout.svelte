<script lang="ts">
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import '../app.css';
	import { role, homepage, loading, homeLoading } from '$lib/state.svelte';
	import moveverso from '$lib/assets/moveverso.png';
	import moveversowide from '$lib/assets/moveversowide.png';
	import Sair from 'virtual:icons/mdi/logout';
	let loadingLocal = $state(false);
	async function handleLogout() {
		loadingLocal = true;
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
			return;
		} finally {
			role.value = 'guest';
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
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
</svelte:head>

<div class="flex w-full flex-col items-center gap-15">
	<div class="absolute -z-1 h-[400px] w-full bg-gradient-to-b from-black to-black/0"></div>
	<a
		href="/"
		class="relative mt-10 -mb-10 transition-all {homepage.value
			? 'w-[320px] md:w-[650px]'
			: 'w-[200px] md:w-[450px]'}"
	>
		<img src={moveverso} class="drop-shadow-accent/50 drop-shadow-[0_0_20px] md:hidden" alt="" />
		<img
			src={moveversowide}
			class="drop-shadow-accent/50 hidden drop-shadow-[0_0_20px] md:block"
			alt=""
		/>
	</a>
	{@render children()}
	<div
		class="static bottom-0 h-[150px] w-full bg-gradient-to-t from-black to-black/0 {loading.value ||
		loadingLocal ||
		homeLoading.value
			? 'hidden'
			: ''}"
	></div>
</div>

{#if role.value !== 'guest'}
	<div class="fixed right-2 bottom-2">
		<button
			onclick={() => handleLogout()}
			class="text-secondary flex items-center gap-3 px-6 {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent cursor-pointer rounded-full p-3 drop-shadow-lg transition-transform hover:-translate-y-1"
		>
			<span>Sair</span>
			<Sair />
		</button>
	</div>
{/if}
