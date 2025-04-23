<script lang="ts">
	import { userArray } from '$lib/state.svelte';
	let sortedUsers = $state([] as any[]);

	$effect(() => {
		sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
	});
</script>

<div class="w-full">
	<h1 class="text-center">Ranking</h1>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full items-center justify-center">
			<span class="w-[3%]">Nº</span>
			<span class="w-[33%] p-1">Nome</span>
			<span class="w-[10%] text-end">Nível</span>
			<span class="w-[10%] text-end">Fase</span>
			<span class="w-[10%] text-end">Pontos</span>
		</div>
		{#each sortedUsers as user, i}
			<div class="flex w-full items-center justify-center">
				<span class="w-[3%]">{i + 1}.</span>
				<a href={`/${user.id}`} class="bg-primary/30 w-[33%] rounded-lg p-1 text-left"
					>{user.name}</a
				>
				<span class="w-[10%] text-end">{user.nivel}</span>
				<span class="w-[10%] text-end">{user.fase}</span>
				<span class="w-[10%] text-end">{user.total}</span>
			</div>
		{/each}
	</div>
</div>
