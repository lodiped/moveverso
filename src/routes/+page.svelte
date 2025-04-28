<script lang="ts">
	import { onMount } from 'svelte';
	import { check, userArray } from '$lib/state.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	import moveverso from '$lib/assets/moveverso.png';
	let loading = $state(true);
	let sortedUsers = $state([] as any[]);
	let error = $state(false);

	onMount(async () => {
		await check()
			.catch((err) => {
				console.error(err);
				error = true;
			})
			.then(() => {
				sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
				loading = false;
			});
	});
</script>

<div class="mt-10 flex w-[1000px] flex-col items-center gap-15">
	<div class="w-1/2">
		<img src={moveverso} class="drop-shadow-accent/50 drop-shadow-[0_0_20px]" alt="" />
	</div>
	{#if loading}
		<div class="w-full text-center">loading</div>
	{:else}
		<Leaderboard />
	{/if}
	{#if error}
		<div>Erro ao carregar</div>
		<div>Fale com o Pedro</div>
	{/if}
</div>
