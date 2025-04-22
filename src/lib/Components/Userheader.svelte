<script lang="ts">
	import { titles, userArray, check } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import type { UserConquista } from '$lib/types.svelte';

	let user = $state(
		{} as {
			id: string;
			ingress: string;
			name: string;
			fase: number;
			nivel: number;
			total: number;
			current: number;
			conquistas: UserConquista[];
		}
	);

	let imgsrc = $derived(`/assets/${user.fase}${user.nivel}.png`);
	onMount(() => {
		check().then(() => {
			console.log(userArray);
			const u = userArray.value[0];
			user.id = u.id;
			user.ingress = u.ingress;
			user.name = u.name;
			user.fase = u.fase;
			console.log(user.fase);
			user.nivel = u.nivel;
			user.total = u.total;
			user.current = u.current;
			user.conquistas = u.conquistas;
			console.log('user.conquistas = ', user.conquistas);
			console.log('user = ', JSON.stringify(user, null, 4));
		});
	});
</script>

<div class="flex items-center justify-center gap-2">
	<div class="flex w-1/2 items-center justify-center">
		<img src={imgsrc} alt="" class="rounded-3xl" />
	</div>
	<div class="flex w-1/2 flex-col items-start justify-center gap-4">
		<div class="flex w-full flex-col items-center">
			<h2 class="drop-shadow-accent/85 drop-shadow-lg">{user.name}</h2>
			<div class="flex w-full justify-center text-sm opacity-50">
				<span>
					desde {user.ingress}
				</span>
			</div>
		</div>
		<div class="flex flex-col items-start justify-center">
			<p>Fase:</p>
			<p class="font-magic drop-shadow-accent/50 text-4xl font-bold drop-shadow-lg">
				<span class="font-[JetBrains_Mono] text-2xl opacity-50">{user.fase}.</span>
				{titles.fase?.[user.fase - 1]?.title ?? '--'}
			</p>
		</div>
		<div class="flex flex-col items-start justify-center">
			<p>Nível:</p>
			<p class="font-magic drop-shadow-accent/50 text-3xl font-bold drop-shadow-lg">
				<span class="font-[JetBrains_Mono] text-2xl opacity-50">{user.nivel}.</span>
				{titles.fase?.[user.fase]?.nivel[user.nivel] ?? '--'}
			</p>
		</div>
		<p>Pontos: <span>{user.current}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
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
		<p>Progresso Total: <span>{user.total}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
				style={`width: ${user.total / 75}%;`}
			></div>
		</div>
		<div class=" drop-shadow-accent/70 p-2 drop-shadow-[0_0_15px]">
			Conquistas <span class="opacity-30">{user.conquistas?.length ?? 0}</span>
		</div>
		{#if user.conquistas?.length > 0}
			<div class="flex items-center justify-center gap-5">
				{#each user.conquistas as conquista}
					{#if conquista.number > 0}
						<div class="inline-block w-full text-center">
							<p
								title={conquista.desc}
								class="drop-shadow-accent/70 cursor-default text-4xl drop-shadow-[0_0_15px] hover:scale-105"
							>
								{conquista.img}
								{#if conquista.number > 1}
									<span>{conquista.number}</span>
								{/if}
							</p>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
