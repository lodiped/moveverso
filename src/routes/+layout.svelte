<script lang="ts">
	import { signOut } from 'firebase/auth';
	import { get, ref, getDatabase, set } from 'firebase/database';
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
	let date = new Date();

	// \/ \/ \/ \/ \/ \/ START - FINALIZAR BUTTON - START \/ \/ \/ \/ \/ \/

	async function finalizar() {
		let currentMonth = date.getMonth() + 1;
		let snapshot = await get(ref(getDatabase(), `historicoIdx`));
		let array = [];
		if (snapshot) array = snapshot.val() ?? [];
		let hasMonthlyRecord = false;
		for (let i = 0; i < array.length; i++) {
			let checkMonth = new Date(array[i]).getMonth() + 1;
			if (currentMonth === checkMonth) {
				hasMonthlyRecord = true;
				break;
			}
		}
		if (hasMonthlyRecord) {
			set(ref(getDatabase(), `historicoIdx/${array.length}`), new Date());
		}
	}

	// /\ /\ /\ /\ /\ /\ END - FINALIZAR BUTTON - END /\ /\ /\ /\ /\ /\

	let { children } = $props();
</script>

<svelte:head>
	<title>Moveverso</title>
	<!-- linha abaixo está dentro do {@html} porque dá erro (inerte) no value="notranslate" -->
	{@html `<meta name="google" value="notranslate" />`}
	<meta name="google" content="notranslate" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
</svelte:head>

<div class="flex min-h-[100vh] w-full flex-col items-center gap-15">
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
		homeLoading.value ||
		homepage.value
			? 'hidden'
			: ''}"
	></div>
</div>

{#if role.value !== 'guest'}
	<div class="fixed right-2 bottom-2 flex flex-col gap-2">
		{#if role.value === 'admin' || role.value === 'bpo' || role.value === 'contabil'}
			<button
				onclick={() => {
					finalizar();
				}}
				class="text-accent bg-accent/10 hover:drop-shadow-accent glass-bg flex items-center gap-3 rounded-full p-3 px-6 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_10px] active:translate-y-0"
			>
				Finalizar Mês
			</button>
		{/if}
		<button
			onclick={() => handleLogout()}
			class="text-accent hover:drop-shadow-accent actice:translate-y-0 flex items-center justify-center gap-3 px-6 hover:drop-shadow-[0_0_10px] {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent/10 glass-bg cursor-pointer rounded-full p-3 transition-all hover:-translate-y-1"
		>
			<span>Sair</span>
			<Sair />
		</button>
	</div>
{/if}
