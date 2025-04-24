<script lang="ts">
	import { userArray } from '$lib/state.svelte';
	let sortedUsers = $state([] as any[]);

	$effect(() => {
		sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
	});
</script>

<div class=" w-full">
	<h2 class="-z-10 text-center">Ranking</h2>
	<div class=" flex w-full flex-col items-center gap-2">
		<div class="flex w-full items-center justify-center">
			<span class="w-[3%]">Nº</span>
			<span class="w-[77%] px-2">Nome</span>
			<span class="w-[6%] text-end">Nível</span>
			<span class="w-[6%] text-end">Fase</span>
			<span class="w-[6%] text-end">Total</span>
		</div>
		{#each sortedUsers as user, i}
			<div
				class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg nth-2:drop-shadow-[0_0_15px]"
			>
				<span class="w-[3%] text-end opacity-50">{i + 1}.</span>
				<a
					href={`/${user.id}`}
					class="bg-primary/30 hover:bg-primary/50 w-[77%] rounded-lg p-1 px-2 text-left transition-all"
					>{user.name}</a
				>
				<span class="w-[6%] text-end">{user.nivel}</span>
				<span class="w-[6%] text-end">{user.fase}</span>
				<span class="w-[6%] text-end">{user.total}</span>
			</div>
		{/each}
	</div>
</div>
