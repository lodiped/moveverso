<script lang="ts">
	import { userArray } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	let sortedUsers = $state([] as any[]);

	onMount(() => {
		sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
	});
</script>

<div>
	<h1>Leaderboard</h1>
	<div>
		{#each sortedUsers as user, i}
			<div class="flex">
				<div class="flex w-full justify-between">
					<span class="w-10">{i + 1}.</span>
					<span class="w-full text-left">{user.name}</span>
					<span class="w-full text-left">{user.nivel}</span>
					<span class="w-full text-left">{user.fase}</span>
					<span class="w-10 text-end">{user.total}</span>
				</div>
			</div>
		{/each}
	</div>
</div>
