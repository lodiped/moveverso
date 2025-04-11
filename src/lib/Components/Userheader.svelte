<script>
	import { titles } from '$lib/state.svelte';
	let { user } = $props();
	let conquistas = $state(false);
</script>

<div class="flex flex-col items-center justify-center gap-5">
	<div class="bg-secondary flex h-20 w-20 items-center justify-center rounded-3xl text-white">
		foto
	</div>
	<div class="flex flex-col items-center justify-center gap-2">
		<h2>{user.name}</h2>
		<div class="flex flex-col items-center justify-center">
			<p>
				Fase {user.fase + 1}:
			</p>
			<p class="font-magic text-4xl font-bold">{titles.fase[user.fase].title}</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>
				Nivel {user.nivel + 1}:
			</p>
			<p class="font-magic text-3xl font-bold">{titles.fase[user.fase].nivel[user.nivel]}</p>
		</div>
		<p>Pontos: <span>{user.current}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
				style={`width: ${user.current / 15}%;`}
			></div>
			<div class="bg-bg absolute top-0 left-[9%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[19%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[29%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[39%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[49%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[59%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[69%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[79%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[89%] h-full w-1"></div>
		</div>
		<p>Progresso Total: <span>{user.total}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
				style={`width: ${user.total / 75}%;`}
			></div>
		</div>
		<button
			onclick={() => {
				conquistas = !conquistas;
			}}
			class="bg-primary/30 drop-shadow-accent/70 rounded-lg p-2 drop-shadow-[0_0_15px]"
			>Conquistas <span class="opacity-30">{user.conquistas.length}</span>
			<span class="opacity-50 {conquistas ? 'rotate-180' : ''}">v</span></button
		>
		{#if conquistas}
			{#if user.conquistas.length > 0}
				<div class="flex items-center justify-center gap-5">
					{#each user.conquistas as conquista}
						<div class="inline-block w-full text-center">
							<p
								title={conquista.title}
								class="drop-shadow-accent/70 cursor-default text-4xl drop-shadow-[0_0_15px] hover:scale-105"
							>
								{conquista.img}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
