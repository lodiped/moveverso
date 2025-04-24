<script lang="ts">
	import {
		titlesfem,
		titles,
		userArray,
		check,
		sumConquistasCalc,
		totalConquistas
	} from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import type { UserConquista } from '$lib/types.svelte';
	let { user, imgsrc } = $props();

	onMount(() => {});
</script>

<div class="flex items-center justify-center gap-5">
	<div class="flex w-1/2 items-center justify-center">
		{#if imgsrc}
			<img src={imgsrc} alt="" class="rounded-3xl" />
		{/if}
	</div>
	<div class="flex w-1/2 flex-col items-start justify-center gap-4">
		<div class="flex w-full flex-col items-center pt-5">
			<h2 class="drop-shadow-accent/70 drop-shadow-[0_0_10px]">{user.name}</h2>
			<div class="flex w-full justify-center text-sm opacity-50">
				<span>
					desde {user.ingress}
				</span>
			</div>
		</div>
		<div class="flex flex-col items-start justify-center">
			<p class="opacity-50">Fase:</p>
			<p class="font-magic text-4xl font-bold">
				<span class="text-accent font-[JetBrains_Mono] text-2xl opacity-50">{user.fase}</span>
				{titles.fase?.[user.fase - 1]?.title ?? '--'}
			</p>
		</div>
		<div class="flex flex-col items-start justify-center">
			<p class="opacity-50">Nível:</p>
			<p class="font-magic text-3xl font-bold">
				<span class="text-accent font-[JetBrains_Mono] text-2xl opacity-50">{user.nivel}</span>
				{user.gender === 'f'
					? titlesfem.fase?.[user.fase - 1]?.nivel[user.nivel - 1]
					: (titles.fase?.[user.fase - 1]?.nivel[user.nivel - 1] ?? '--')}
			</p>
		</div>
		<div class="flex w-full flex-col items-start justify-center gap-2">
			<p><span class="opacity-50">Pontos:</span> <span>{user.current}</span></p>
			<div class="bg-secondary relative h-4 w-full rounded-md">
				<div
					class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] content-['']"
					style={`width: ${user.current / 15}%;`}
				></div>
				<div class="bg-bg absolute top-0 left-[9.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[19.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[29.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[39.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[49.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[59.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[69.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[79.5%] h-full w-0.5"></div>
				<div class="bg-bg absolute top-0 left-[89.5%] h-full w-0.5"></div>
			</div>
		</div>
		<div class="flex w-full flex-col items-start justify-center gap-2">
			<p><span class="opacity-50">Progresso Total:</span> <span>{user.total}</span></p>
			<div class="bg-secondary relative h-4 w-full rounded-md">
				<div
					class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] content-['']"
					style={`width: ${user.total / 75}%;`}
				></div>
			</div>
		</div>
		<div class="flex flex-col items-start justify-center gap-2">
			<div>
				<span class="opacity-50">Conquistas:</span> <span>{totalConquistas.value}</span>
			</div>
			{#if user.conquistas?.length > 0}
				<div class=" flex items-start justify-center gap-5">
					{#each user.conquistas as conquista}
						{#if conquista.number > 0}
							<div class=" inline-block w-full text-center align-top">
								<div
									title={conquista.desc}
									class="drop-shadow-accent/70 flex cursor-default flex-col justify-start text-4xl drop-shadow-[0_0_15px] hover:scale-105"
								>
									<p class="">
										{conquista.img}
									</p>
									{#if conquista.number > 1}
										<span class="text-lg opacity-50">{conquista.number}x</span>
									{/if}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
