<script lang="ts">
	import { userArray, logPage } from '$lib/state.svelte';
	let sortedUsers = $state([] as any[]);

	$effect(() => {
		sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
	});
</script>

<div class="flex w-full flex-col items-center px-2 lg:px-0">
	<h2 class="-z-10 text-center">Ranking</h2>
	<div class="flex w-full max-w-[750px] flex-col items-center gap-2">
		<div class="flex w-full items-center justify-center">
			<span class="w-[7%] text-end text-sm">Nº.</span>
			<span class="w-[57%] px-2 text-sm">Nome</span>
			<span class="w-[11%] text-end text-sm">Nível</span>
			<span class="w-[11%] text-end text-sm">Fase</span>
			<span class="w-[13%] text-end text-sm">Total</span>
		</div>
		{#each sortedUsers as user, i}
			<div
				class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
			>
				<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
				<a
					onclick={() => {
						logPage.value = 1;
					}}
					href={`/${user.id}`}
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
