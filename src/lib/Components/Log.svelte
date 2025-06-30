<script lang="ts">
	import { userLog, role, logPage, hasMore } from '$lib/state.svelte';
	import { date } from '$lib/time.svelte';
	let { user, remove, prevPage, nextPage } = $props();
	// @ts-ignore
	import Login from 'virtual:icons/mdi/login';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';

	let loginInfo = $state(false);
</script>

<div class="flex flex-col items-center gap-5 px-2 lg:px-0">
	<h2 class="-mb-2 text-center">Histórico</h2>
	{#if role.value === 'guest'}
		<div class="flex justify-center">
			<div
				class="bg-primary/20 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 p-2"
			>
				<input
					type="password"
					placeholder="Senha"
					class="w-full appearance-none border-0 bg-transparent"
				/>
				<button
					onclick={() => {
						loginInfo = true;
					}}
					class="cursor-pointer text-xl opacity-50 transition-opacity hover:opacity-100"
					><Info /></button
				>
				<button class="bg-primary/30 flex items-center justify-center gap-2 rounded-lg p-2"
					><Login /><span>Entrar</span></button
				>
			</div>
		</div>
	{:else if userLog.value.length === 0}
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
				{#if role.value === 'admin'}
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
	{/if}
</div>

{#if loginInfo}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col items-center gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">Login</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<p>Para ver o seu histórico insira a sua senha. (Ainda não implementado)</p>
				</div>
			</div>
			<button
				class="bg-primary text-secondary w-fit cursor-pointer rounded-lg p-2 px-4"
				onclick={() => (loginInfo = false)}>Fechar</button
			>
		</div>
	</div>
{/if}
