<script lang="ts">
	import { userLog, isAdmin, logPage, hasMore } from '$lib/state.svelte';
	import { date } from '$lib/time.svelte';
	let { user, remove, prevPage, nextPage } = $props();
</script>

<div class="flex flex-col gap-5 px-2 lg:px-0">
	<h2 class="-mb-4 w-full text-center">Histórico</h2>
	{#if userLog.value.length === 0}
		<div class="flex w-full items-center justify-center gap-8">
			<span class=" p-1 px-2.5">Sem registros</span>
		</div>
	{:else}
		{#each userLog.value as log, i}
			<div class="flex justify-between gap-5">
				<div
					class="flex w-[5rem] items-center justify-center rounded-lg border border-white/20 text-lg backdrop-blur-xs"
				>
					{#if log.value}
						<span class={log.value > 0 ? 'text-green-600' : 'text-red-600'}>{log.value}</span>
					{:else}
						<span class={log.points > 0 ? 'text-green-600' : 'text-red-600'}>{log.points}</span>
					{/if}
				</div>
				<div class="w-full">
					<p class="flex gap-5">
						<span>{log.text}</span>
					</p>
					<p class="text-xs opacity-50">{date(log.id)}</p>
				</div>
				{#if isAdmin.value}
					<button
						onclick={() => {
							remove(log.id, user.id, log.action, log.type);
						}}
						class="cursor-pointer rounded-lg border border-red-500 px-3 text-lg hover:bg-red-500 hover:text-black"
						>x</button
					>
				{/if}
			</div>
			<hr class={i === userLog.value.length - 1 ? 'hidden' : 'opacity-20'} />
		{/each}
	{/if}
	<div class="flex w-full items-center justify-center gap-8">
		<div>
			<button class={logPage.value === 1 ? 'opacity-40' : ''} onclick={prevPage}
				>&lt; Anterior</button
			>
		</div>
		<span class="rounded-lg border border-white/20 p-1 px-2.5">{logPage.value}</span>
		<div>
			<button class={hasMore.value ? '' : 'opacity-40'} onclick={nextPage}>Próxima &gt;</button>
		</div>
	</div>
</div>
