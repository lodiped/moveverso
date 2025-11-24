<script lang="ts">
	import { signInWithPopup } from 'firebase/auth';
	import { googleProvider } from '$lib/firebase';
	import { names } from '$lib/currentUser.svelte';
	import { signOut } from 'firebase/auth';
	import { get, ref, getDatabase, set, remove } from 'firebase/database';
	import { auth } from '$lib/firebase';
	import '../app.css';
	import {
		role,
		homepage,
		loading,
		homeLoading,
		nivelCalc,
		faseCalc,
		currentCalc
	} from '$lib/state.svelte';
	import moveverso from '$lib/assets/moveverso.png';
	import moveversowide from '$lib/assets/moveversowide.png';
	import Sair from 'virtual:icons/mdi/logout';
	import Star from 'virtual:icons/mdi/star-four-points';
	import Close from 'virtual:icons/mdi/close-circle-outline';
	import Google from 'virtual:icons/mdi/google';
	let loadingLocal = $state(false);

	let logoutModal = $state(false);
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
			logoutModal = false;
			return;
		}
	}
	let date = new Date();

	// \/ \/ \/ \/ \/ \/ START - FINALIZAR BUTTON - START \/ \/ \/ \/ \/ \/

	let finalizando = $state(false);
	let finalizarModal = $state(false);

	async function finalizar() {
		finalizando = true;
		let currentMonth = date.getMonth() + 1;
		let hasMonthlyRecord = false;
		let monthlyRecordMs = 0;
		try {
			let snapshot = await get(ref(getDatabase(), `historicoIdx`));
			let array = [];
			if (snapshot) array = snapshot.val() ?? [];
			for (let i = 0; i < array.length; i++) {
				let checkMonth = new Date(array[i] * 1000).getMonth() + 1;
				if (array.length > 0) {
					if (currentMonth === checkMonth) {
						hasMonthlyRecord = true;
						monthlyRecordMs = array[i];
						break;
					}
				}
			}
			let dateMs: number = +(Date.now() / 1000).toFixed(0);

			try {
				try {
					let newsnapshot = await get(ref(getDatabase(), `totals`));
					let totalsToRecord = newsnapshot ? newsnapshot.val() : null;
					if (totalsToRecord === null) {
						throw new Error('Totals nao encontrados');
					}
					if (hasMonthlyRecord) {
						try {
							await remove(ref(getDatabase(), `historico/${monthlyRecordMs}`));
							await remove(ref(getDatabase(), `historicoIdx/${array.indexOf(monthlyRecordMs)}`));
							await set(ref(getDatabase(), `historico/${dateMs}`), totalsToRecord);
							await set(ref(getDatabase(), `historicoIdx/${array.length - 1}`), dateMs);
							window.location.reload();
						} catch (err) {
							console.error(err);
						}
					} else {
						await set(ref(getDatabase(), `historicoIdx/${array.length}`), dateMs);
						await set(ref(getDatabase(), `historico/${dateMs}`), totalsToRecord);
						window.location.reload();
					}
				} catch (error) {
					console.error(error);
					finalizando = false;
				}
			} catch (error) {
				console.error(error);
				finalizando = false;
			}
			finalizando = false;
		} catch (error) {
			console.error(error);
			finalizando = false;
		} finally {
			finalizarModal = false;
		}
	}

	// /\ /\ /\ /\ /\ /\ END - FINALIZAR BUTTON - END /\ /\ /\ /\ /\ /\

	let { children } = $props();

	async function handleGoogleSignIn() {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log('GOOGLE STUFF: ', user);
		} catch (error) {
			console.log(error);
		}
	}
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
					finalizarModal = true;
				}}
				class="text-accent bg-accent/10 hover:drop-shadow-accent glass-bg flex items-center justify-center gap-3 rounded-full p-3 px-6 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_10px] active:translate-y-0"
			>
				{#if finalizando}
					<Star
						class="text-accent drop-shadow-accent w-[10ch] animate-spin text-xl drop-shadow-[0_0_10px]"
					/>
				{:else}
					Finalizar Mês
				{/if}
			</button>
		{/if}
		<button
			onclick={() => (logoutModal = true)}
			class="text-accent hover:drop-shadow-accent actice:translate-y-0 flex items-center justify-center gap-3 px-6 hover:drop-shadow-[0_0_10px] {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent/10 glass-bg cursor-pointer rounded-full p-3 transition-all hover:-translate-y-1"
		>
			<span>Sair</span>
			<Sair />
		</button>
	</div>
{:else}
	<div class="fixed right-2 bottom-2 flex flex-col gap-2">
		<button
			onclick={handleGoogleSignIn}
			class="text-accent hover:drop-shadow-accent actice:translate-y-0 flex items-center justify-center gap-3 px-6 hover:drop-shadow-[0_0_10px] {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent/10 glass-bg cursor-pointer rounded-full p-3 transition-all hover:-translate-y-1"
		>
			<Google />
			<span>Entrar</span>
		</button>
	</div>
{/if}

{#if logoutModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (logoutModal = false)}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative flex max-w-[80ch] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			Tem certeza que deseja sair?
			<button class="bg-primary/30 rounded-lg p-3 px-5" onclick={() => handleLogout()}>Sim</button>
			<button
				class=" text-primary absolute top-2 right-2 rounded-full text-2xl"
				onclick={() => (logoutModal = false)}
				><Close />
			</button>
		</div>
	</div>
{/if}

{#if finalizarModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (finalizarModal = false)}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative z-50 flex max-w-[80ch] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			Tem certeza que deseja finalizar o mês? Esta ação irá enviar os dados para a base de dados dos
			históricos.
			<button class="bg-primary/30 rounded-lg p-3 px-5" onclick={async () => await finalizar()}
				>Confirmar Finalização</button
			>
			<button
				class=" text-primary absolute top-2 right-2 rounded-full text-2xl"
				onclick={() => (finalizarModal = false)}
				><Close />
			</button>
		</div>
	</div>
{/if}
