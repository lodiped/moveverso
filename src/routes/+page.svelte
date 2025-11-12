<script lang="ts">
	import {
		homepage,
		logPage,
		homeLoading,
		role,
		faseCalc,
		nivelCalc,
		currentCalc
	} from '$lib/state.svelte';
	import { listenTotals, bpoList, contabilList, names } from '$lib/currentUser.svelte';
	import { get, ref, getDatabase } from 'firebase/database';
	let error = $state(false);
	import Star from 'virtual:icons/mdi/star-four-points';
	import { msToString } from '$lib/time.svelte';
	import Filter from 'virtual:icons/mdi/slider';

	import { slide } from 'svelte/transition';
	import Chevron from 'virtual:icons/mdi/chevron-down';
	import { onMount } from 'svelte';

	let loadDb;
	// async function getTotals() {
	// 	loading = true;
	// 	try {
	// 		const snapshot = await get(ref(getDatabase(), 'totals'));
	// 		list = snapshot.val();
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		loading = false;
	// 	}
	// }

	// \/ \/ \/ \/ \/ \/ FETCH HISTORICO \/ \/ \/ \/ \/ \/

	let historico = $state(false);
	let historicoTab: number | null = $state(null);
	let historicoIdx = $state([]);
	let historicoObj = $state({});
	let historicoContabil: any[] = $state([]);
	let historicoBPO: any[] = $state([]);

	async function fetchHistoricoIdx() {
		try {
			const snapshot = await get(ref(getDatabase(), 'historicoIdx'));
			historicoIdx = snapshot.val();
			console.log('historicoIdx: ', historicoIdx);
		} catch (error) {
			console.error(error);
		}
	}
	async function getHistorico(idx: number, i: number) {
		try {
			const snapshot = await get(ref(getDatabase(), `historico/${idx}`));
			if (snapshot.exists()) {
				historicoObj = snapshot.val();
				processData(historicoObj);

				historicoTab = i;
			}
			console.log('historicoObj: ', historicoObj);
		} catch (error) {
			console.error(error);
		}
	}

	function processData(data: Record<string, { value: number; type: string }>) {
		const all = Object.entries(data)
			.map(([id, { value, type }]: any) => {
				if (role.value !== 'admin' && id === 'usuarioteste') return null;
				const name = names[id] ?? id;
				const fase = faseCalc(value, type === 'bpo' ? 'bpo' : '');
				const nivel = nivelCalc(
					currentCalc(value, fase, type === 'bpo' ? 'bpo' : ''),
					type === 'bpo' ? 'bpo' : ''
				);
				return { id, name, fase, nivel, total: value, type };
			})
			.filter((u) => u !== null);

		historicoContabil = all.filter((u) => u.type === 'contabil').sort((a, b) => b.total - a.total);
		historicoBPO = all.filter((u) => u.type === 'bpo').sort((a, b) => b.total - a.total);
	}

	// /\ /\ /\ /\ /\ /\ /\ END - FETCH HISTORICO - END /\ /\ /\ /\ /\ /\ /\

	let date = new Date();
	let month = $state(date.toLocaleString('pt-BR', { month: 'long' }));
	let currentMonth = $derived(month);

	let unsubscribe: any;
	$effect(() => {
		homepage.value = true;
		listenTotals().then((fn) => {
			unsubscribe = fn;
			homeLoading.value = false;
		});
		return () => {
			unsubscribe?.();
		};
	});

	let selectedTab: string | null = $state('contabil');
	let rankTab: string | null = $state('geral');

	function getSelected() {
		if (localStorage.getItem('selected')) {
			selectedTab = localStorage.getItem('selected');
		} else {
			selectedTab = 'contabil';
			localStorage.setItem('selected', selectedTab);
		}
		if (localStorage.getItem('rank')) {
			rankTab = localStorage.getItem('rank');
		} else {
			rankTab = 'geral';
			localStorage.setItem('rank', rankTab);
		}
	}

	function setSelected(selected: 'contabil' | 'bpo') {
		localStorage.setItem('selected', selected);
		selectedTab = selected;
	}

	function setRank(rank: 'geral' | 'mensal') {
		localStorage.setItem('rank', rank);
		rankTab = rank;
	}

	onMount(() => {
		getSelected();
	});
</script>

{#snippet starDecal()}
	<Star
		class="text-accent drop-shadow-accent absolute -top-1 right-2 text-sm drop-shadow-[0_0_10px]"
	/>
	<Star
		class="text-accent drop-shadow-accent absolute top-2 -right-1 text-sm drop-shadow-[0_0_10px]"
	/>
{/snippet}

{#snippet historicoBtn()}
	{#if rankTab === 'mensal' && !homeLoading.value && !error && (role.value === 'admin' || role.value === 'bpo' || role.value === 'cultura' || role.value === 'contabil')}
		<div class="flex w-full justify-center">
			<button
				transition:slide
				onclick={() => {
					fetchHistoricoIdx();
					historico = true;
				}}
				class="glass-bg text-accent hover:drop-shadow-accent relative flex w-fit items-center justify-center gap-4 rounded-lg px-4 py-2 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_15px] active:translate-y-0"
				>Histórico
				{@render starDecal()}
			</button>
		</div>
	{/if}
{/snippet}

{#snippet rankSwitch()}
	<div class="flex w-full items-center justify-between p-2">
		<div class="text-accent w-full font-['Grifter'] text-2xl tracking-wider capitalize">
			{rankTab === 'geral' ? 'Geral' : currentMonth}
		</div>
		<div class="flex w-full items-center justify-end gap-2 pb-2">
			<Filter />
			<div></div>
			<span
				class="text-sm font-bold {rankTab === 'mensal'
					? 'text-white drop-shadow-[0_0_4px_white] drop-shadow-white'
					: 'text-white/50'}">Mensal</span
			>
			<button
				onclick={() => {
					if (rankTab === 'geral') {
						setRank('mensal');
					} else {
						setRank('geral');
					}
				}}
				aria-label="Mensal ou Geral"
				class="border-primary/60 relative flex min-h-[2ch] min-w-[4ch] items-center rounded-full border-2"
			>
				<div
					class="absolute left-0 mr-4 ml-0.75 min-h-[1ch] min-w-[1ch] translate-x-[0ch] {rankTab ===
					'geral'
						? 'translate-x-[2ch]'
						: ''} bg-accent rounded-full transition-all"
				></div>
			</button>
			<span
				class="text-sm font-bold {rankTab === 'geral'
					? 'text-white drop-shadow-[0_0_4px_white] drop-shadow-white'
					: 'text-white/50'}">Geral</span
			>
		</div>
	</div>
{/snippet}

<div
	class="mt-4 flex w-full max-w-[1000px] flex-col items-center gap-15 2xl:mt-10 2xl:items-start 2xl:gap-5"
>
	{#if homeLoading.value}
		<div class="relative flex w-full justify-center text-center">
			<Star class="text-accent drop-shadow-accent animate-spin text-xl drop-shadow-[0_0_10px]" />
		</div>
	{:else}
		<div class="flex w-[20rem] rounded-xl border border-white/20 2xl:hidden">
			<button
				onclick={() => setSelected('contabil')}
				class="drop-shadow-accent/60 w-1/2 rounded-lg px-5 py-4 text-center font-['Grifter'] text-xl tracking-wider uppercase transition-all {selectedTab ===
				'contabil'
					? 'bg-accent scale-110 text-black/60 drop-shadow-[0_0_15px]'
					: 'text-accent glass-bg'}">Contábil</button
			>
			<button
				onclick={() => setSelected('bpo')}
				class="drop-shadow-accent/60 w-1/2 rounded-lg px-5 py-4 text-center font-['Grifter'] text-xl tracking-wider uppercase transition-all {selectedTab ===
				'bpo'
					? 'bg-accent scale-110 text-black/60 drop-shadow-[0_0_15px]'
					: 'text-accent glass-bg cursor-pointer'}">Financeiro</button
			>
		</div>
		<div class="flex w-full flex-col items-center gap-15 2xl:flex-row 2xl:items-start 2xl:gap-5">
			<div
				class="w-full flex-col items-center gap-4 px-2 lg:px-0 {selectedTab === 'contabil'
					? 'flex'
					: 'hidden 2xl:flex'}"
			>
				<h2 class="hidden text-center 2xl:block">Contábil</h2>
				<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
					{@render rankSwitch()}
					<div class="flex w-full items-center justify-center">
						<span class="w-[7%] text-end text-sm">Nº.</span>
						<span class="w-[57%] px-2 text-sm">Nome</span>
						<span class="w-[11%] text-end text-sm">Nível</span>
						<span class="w-[11%] text-end text-sm">Fase</span>
						<span class="w-[13%] text-end text-sm">Total</span>
					</div>
					{#each contabilList.value as user, i}
						<div
							class="nth-3:bg-accent/30 nth-3:drop-shadow-accent/50 nth-4:bg-primary/25 nth-5:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-3:drop-shadow-[0_0_15px]"
						>
							<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
							<a
								onclick={() => {
									logPage.value = 1;
									homeLoading.value = true;
								}}
								href={`/contabil/${user.id}`}
								class="bg-primary/10 hover:bg-primary/30 glass-bg w-[57%] rounded-full p-1 px-4 text-left transition-all"
								>{user.name}</a
							>
							<span class="w-[11%] text-end">{user.nivel}</span>
							<span class="w-[11%] text-end">{user.fase}</span>
							<span class="w-[13%] text-end">{user.total}</span>
						</div>
					{/each}
				</div>
				{@render historicoBtn()}
			</div>
			<div
				class="w-full flex-col items-center gap-4 px-2 lg:px-0 {selectedTab === 'bpo'
					? 'flex'
					: 'hidden 2xl:flex'}"
			>
				<h2 class="hidden text-center 2xl:block">BPO</h2>
				<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
					{@render rankSwitch()}
					<div class="flex w-full items-center justify-center">
						<span class="w-[7%] text-end text-sm">Nº.</span>
						<span class="w-[57%] px-2 text-sm">Nome</span>
						<span class="w-[11%] text-end text-sm">Nível</span>
						<span class="w-[11%] text-end text-sm">Fase</span>
						<span class="w-[13%] text-end text-sm">Total</span>
					</div>
					{#each bpoList.value as user, i}
						<div
							class="nth-3:bg-accent/30 nth-3:drop-shadow-accent/50 nth-4:bg-primary/25 nth-5:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-3:drop-shadow-[0_0_15px]"
						>
							<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
							<a
								onclick={() => {
									logPage.value = 1;
									homeLoading.value = true;
								}}
								href={`/bpo/${user.id}`}
								class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
								>{user.name}</a
							>
							<span class="w-[11%] text-end">{user.nivel}</span>
							<span class="w-[11%] text-end">{user.fase}</span>
							<span class="w-[13%] text-end">{user.total}</span>
						</div>
					{/each}
				</div>
				{@render historicoBtn()}
			</div>
		</div>
	{/if}
	{#if error}
		<div>Erro ao carregar</div>
		<div>Fale com o Pedro</div>
	{/if}
</div>

{#if historico}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (historico = false)}
		class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/30"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 flex w-[80ch] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			<h2 class="text-center">Histórico</h2>
			<div class="flex w-full flex-col items-center gap-5">
				<div class="flex w-full flex-col items-center justify-center gap-1">
					{#if historicoIdx}
						{#each historicoIdx as idx, i}
							<button
								onclick={() => {
									if (historicoTab === i) {
										historicoTab = null;
									} else {
										getHistorico(idx, i);
									}
								}}
								class="flex w-full items-center justify-between rounded-full bg-white/10 px-5 py-2"
							>
								<div>
									{msToString(idx)}
								</div>
								<div><Chevron /></div>
							</button>
							{#if historicoTab === i}
								<div class="flex w-full flex-col items-center gap-2 px-3 pb-5" transition:slide>
									<div class="flex w-[20rem] justify-center rounded-xl border border-white/20">
										<button
											onclick={() => setSelected('contabil')}
											class="drop-shadow-accent/60 w-1/2 rounded-lg px-4 py-3 text-center font-['Grifter'] text-base tracking-wider uppercase transition-all {selectedTab ===
											'contabil'
												? 'bg-accent scale-110 text-black/60 drop-shadow-[0_0_15px]'
												: 'text-accent bg-primary/10 cursor-pointer'}">Contábil</button
										>
										<button
											onclick={() => setSelected('bpo')}
											class="drop-shadow-accent/60 w-1/2 rounded-lg px-4 py-3 text-center font-['Grifter'] text-base tracking-wider uppercase transition-all {selectedTab ===
											'bpo'
												? 'bg-accent scale-110 text-black/60 drop-shadow-[0_0_15px]'
												: 'text-accent bg-primary/10 cursor-pointer'}">Financeiro</button
										>
									</div>
									{#if selectedTab === 'contabil'}
										{#each historicoContabil as user}
											<div
												class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
											>
												<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
												<div
													class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
												>
													{user.name}
												</div>
												<span class="w-[11%] text-end">{user.nivel}</span>
												<span class="w-[11%] text-end">{user.fase}</span>
												<span class="w-[13%] text-end">{user.total}</span>
											</div>
										{/each}
									{:else if selectedTab === 'bpo'}
										{#each historicoBPO as user}
											<div
												class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
											>
												<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
												<div
													class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
												>
													{user.name}
												</div>
												<span class="w-[11%] text-end">{user.nivel}</span>
												<span class="w-[11%] text-end">{user.fase}</span>
												<span class="w-[13%] text-end">{user.total}</span>
											</div>
										{/each}
									{/if}
								</div>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
			<button
				class="bg-primary text-secondary w-fit cursor-pointer rounded-lg p-2 px-4"
				onclick={() => (historico = false)}>Fechar</button
			>
		</div>
	</div>
{/if}
