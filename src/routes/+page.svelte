<script lang="ts">
	import { check, userArray, homepage, logPage, homeLoading } from '$lib/state.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	import { listenTotals, currentUser, list, bpoList, contabilList } from '$lib/currentUser.svelte';
	import { onValue, ref, getDatabase, get } from 'firebase/database';
	let error = $state(false);
	// @ts-ignore
	import Star from 'virtual:icons/mdi/star-four-points';

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

	let unsubscribe: () => void;
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
</script>

<div class="mt-10 flex w-full max-w-[1000px] flex-col items-center gap-15 2xl:flex-row 2xl:gap-5">
	{#if homeLoading.value}
		<div class="relative flex w-full justify-center text-center">
			<Star class="text-accent drop-shadow-accent animate-spin text-xl drop-shadow-[0_0_10px]" />
		</div>
	{:else}
		<!-- <div>{currentUser.value?.name}</div> -->
		<div class="flex w-full flex-col items-center px-2 lg:px-0">
			<h2 class="-z-10 text-center">Contábil</h2>
			<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
				<div class="flex w-full items-center justify-center">
					<span class="w-[7%] text-end text-sm">Nº.</span>
					<span class="w-[57%] px-2 text-sm">Nome</span>
					<span class="w-[11%] text-end text-sm">Nível</span>
					<span class="w-[11%] text-end text-sm">Fase</span>
					<span class="w-[13%] text-end text-sm">Total</span>
				</div>
				{#each contabilList.value as user, i}
					<div
						class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
					>
						<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
						<a
							onclick={() => {
								logPage.value = 1;
								homeLoading.value = true;
							}}
							href={`/contabil/${user.id}`}
							class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
							>{user.name}</a
						>
						<span class="w-[11%] text-end">{user.nivel}</span>
						<span class="w-[11%] text-end">{user.fase}</span>
						<span class="w-[13%] text-end">{user.total}</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full flex-col items-center px-2 lg:px-0">
			<h2 class="-z-10 text-center">BPO</h2>
			<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
				<div class="flex w-full items-center justify-center">
					<span class="w-[7%] text-end text-sm">Nº.</span>
					<span class="w-[57%] px-2 text-sm">Nome</span>
					<span class="w-[11%] text-end text-sm">Nível</span>
					<span class="w-[11%] text-end text-sm">Fase</span>
					<span class="w-[13%] text-end text-sm">Total</span>
				</div>
				{#each bpoList.value as user, i}
					<div
						class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
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
		</div>
	{/if}
	{#if error}
		<div>Erro ao carregar</div>
		<div>Fale com o Pedro</div>
	{/if}
</div>
