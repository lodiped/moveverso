<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { check, userArray } from '$lib/state.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	let loading = $state(false);
	let sortedUsers = $state([] as any[]);

	onMount(async () => {
		loading = true;
		await check().then(() => {
			sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
			loading = false;
		});
		console.log('auth.currentUser', auth.currentUser);
	});
</script>

<div class="flex w-[1000px] flex-col gap-2">
	{#if loading}
		<div class="w-full text-center">loading</div>
	{:else}
		<Leaderboard />
	{/if}
</div>
