<script lang="ts">
	import { pulseira } from '$lib/currentUser.svelte';
	import { titlesfem, titles, totalConquistas } from '$lib/state.svelte';
	import movesports from '$lib/assets/sports.png';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	// @ts-ignore
	import Pulseira from 'virtual:icons/fa-solid/ring';
	//@ts-ignore
	import Chevron from 'virtual:icons/mdi/chevron-down';
	let { user, imgsrc } = $props();

	let cultureInfo = $state(false);
	let cultureExpand = $state(false);

	let firstname = $state('');
	let lastname = $state('');

	$effect(() => {
		[firstname, lastname] = user.name.split(' ');
	});
</script>

<div class="flex flex-row items-start justify-center gap-5 px-8 md:px-0">
	<div class="relative flex w-[300px] flex-col items-center justify-center gap-4 md:w-1/3">
		{#if imgsrc}
			<img src={imgsrc} alt="Arte do Personagem" class="rounded-3xl" />
		{/if}
		<h2 class="drop-shadow-accent/70 absolute top-61 text-[1.7rem] drop-shadow-[0_0_10px]">
			{firstname}
		</h2>
		<h2 class="drop-shadow-accent/70 absolute top-68 text-[1.7rem] drop-shadow-[0_0_10px]">
			{lastname}
		</h2>
		<div class="text-primary absolute top-77 flex w-full justify-center gap-1 text-xs">
			<span>
				ingresso: {user.ingress}
			</span>
			<span> <Pulseira class="-rotate-45" style={`color: ${pulseira.cincoAnos.color};`} /></span>
		</div>
		<div class="absolute top-90 flex w-full flex-col items-center pt-5">
			<div class="relative h-2.5 w-4/5 rounded-md bg-black">
				<div
					class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
					style={`width: ${user.total / 75}%;`}
				></div>
			</div>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-2">
			{#if user.conquistas?.length > 0}
				<div class="grid grid-cols-3 gap-4">
					{#each user.conquistas as conquista}
						{#if conquista.number > 0}
							<div class=" inline-block w-full text-center align-top">
								<div
									title={conquista.desc}
									class="drop-shadow-accent/70 flex cursor-default flex-col justify-start text-4xl drop-shadow-[0_0_20px] hover:scale-105"
								>
									<p class="drop-shadow-md drop-shadow-black">
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
	<div class="flex w-full flex-col items-start justify-start gap-8 md:w-2/3">
		<h3 class="w-full text-center">PROGRESSO</h3>
		<div class="flex w-full items-center justify-start gap-3">
			<div
				class="bg-primary/20 flex w-15 flex-col items-center justify-between rounded-lg backdrop-blur-xs"
			>
				<p
					class="text-accent drop-shadow-accent/70 flex items-center py-1.5 text-3xl font-bold drop-shadow-[0_0_5px]"
				>
					{user.fase}
				</p>
				<p
					class="bg-accent/40 drop-shadow-accent/70 w-full rounded-b-lg py-0.5 text-center text-xs text-black drop-shadow-[0_0_5px]"
				>
					Fase
				</p>
			</div>
			<div class="flex w-full flex-col items-start justify-center gap-0.5">
				<p class="font-magic text-3xl font-bold">
					{titles.fase?.[user.fase - 1]?.title ?? '--'}
				</p>
				<div class="bg-secondary relative h-4 w-full rounded-md">
					<div
						class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
						style={`width: ${user.current / 15}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p>
						<span class="opacity-50">Pontos <span class="hidden md:inline">nesta fase</span>:</span>
						<span>{user.current}</span>
					</p>
					<p>
						<span class="opacity-50">p/ próxima fase:</span> <span>{1500 - user.current}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full items-center justify-start gap-3">
			<div class="bg-primary/20 flex w-15 flex-col items-center rounded-lg backdrop-blur-xs">
				<p
					class="text-accent drop-shadow-accent/70 py-1.5 text-3xl font-bold drop-shadow-[0_0_5px]"
				>
					{user.nivel}
				</p>
				<p
					class="bg-accent/40 drop-shadow-accent/70 w-full rounded-b-lg py-0.5 text-center text-xs text-black drop-shadow-[0_0_5px]"
				>
					Nível
				</p>
			</div>
			<div class="flex w-full flex-col items-start justify-center gap-0.5">
				<p class="font-magic text-3xl font-bold">
					{user.gender === 'f'
						? titlesfem.fase?.[user.fase - 1]?.nivel[user.nivel - 1]
						: (titles.fase?.[user.fase - 1]?.nivel[user.nivel - 1] ?? '--')}
				</p>
				<div class="bg-secondary relative h-4 w-full rounded-md">
					<div
						class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
						style={`width: ${user.xp / 1.5}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p><span class="opacity-50">Pontos neste nível:</span> <span>{user.xp}</span></p>
					<p>
						<span class="opacity-50">p/ próximo nível:</span> <span>{150 - user.xp}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full flex-col items-center gap-5">
			<h3 class="relative">
				Cultura
				<button
					onclick={() => {
						cultureInfo = !cultureInfo;
					}}
					class="absolute right-0 bottom-0 translate-x-5.75 -translate-y-2 cursor-pointer text-white opacity-50 transition-opacity hover:opacity-100"
				>
					<Info class="text-base" />
				</button>
			</h3>
			<div class="flex w-full items-center justify-between">
				<div
					class="drop-shadow-accent flex w-full flex-col items-center gap-1 drop-shadow-[0_0_20px]"
				>
					<p class="text-accent my-1 text-3xl font-bold drop-shadow-sm drop-shadow-black">9.2</p>
					<p class="text-sm font-bold">Média 360º</p>
				</div>
				<div class="flex w-full flex-col items-center">
					<div class="drop-shadow-accent/50 drop-shadow-[0_0_20px]">
						<div class="flex flex-col items-center gap-1 drop-shadow-md drop-shadow-black">
							<Pulseira style={`color: ${pulseira.cincoAnos.color};`} class="-rotate-45 text-4xl" />
							<div class="text-sm font-bold">{pulseira.cincoAnos.text}</div>
						</div>
					</div>
				</div>
				<div
					class="flex w-full flex-col items-center justify-between gap-3.5 drop-shadow-[0_0_20px] drop-shadow-red-600"
				>
					<img src={movesports} class="w-[50%]" alt="" />
					<p class="text-sm font-bold">Participando</p>
				</div>
				<div
					class="drop-shadow-accent/40 group relative flex w-full flex-col items-center justify-center gap-1 drop-shadow-[0_0_20px] transition-all"
				>
					<div
						class="pointer-events-none absolute top-0 right-0 flex h-full w-full -translate-y-10 cursor-default flex-col items-center justify-center opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
					>
						<p class="text-sm">Recebidas: 12</p>
						<p class="text-sm">Entregues: 8</p>
					</div>
					<div
						class="pointer-events-none drop-shadow-md drop-shadow-black transition-all group-hover:translate-y-10 group-hover:opacity-0"
					>
						<div class="hexagon bg-accent/80 flex h-12 items-center justify-center">
							<div
								class="hexagon bg-secondary text-accent flex h-10 cursor-default items-center justify-center text-xl font-bold"
							>
								12
							</div>
						</div>
					</div>
					<p
						class="pointer-events-none text-sm font-bold transition-all group-hover:translate-y-10 group-hover:opacity-0"
					>
						Coins
					</p>
				</div>
			</div>
			<button
				onclick={() => (cultureExpand = !cultureExpand)}
				class="cursor-pointer transition-all {cultureExpand ? 'rotate-180' : ''}"
				><Chevron class="text-primary text-2xl" /></button
			>
			{#if cultureExpand}
				<div class="flex w-full flex-col items-center gap-2">
					<p class="text-xl">Presença:</p>
					<div class="bg-secondary relative h-4 w-full rounded-md">
						<div
							class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
							style={`width: 50%;`}
						>
							<span class="pr-2 text-xs text-black opacity-50">Treinamentos</span>
						</div>
					</div>
					<div class="bg-secondary relative h-4 w-full rounded-md">
						<div
							class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
							style={`width: 50%;`}
						>
							<span class="pr-2 text-xs text-black opacity-50">Cumbuca</span>
						</div>
					</div>
				</div>
				<div class="flex w-full justify-around">
					<div class="flex flex-col items-center">
						<div class="text-xl">Move Sports:</div>
						<div class="flex text-xl drop-shadow-[0_0_12px] drop-shadow-[slateblue]">
							<div class="drop-shadow-md drop-shadow-black">🎙️</div>
							<div class="drop-shadow-md drop-shadow-black">💎</div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<p class="text-xl">Move Coins:</p>
						<p>Recebidas: 12</p>
						<p>Entregues: 7</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if cultureInfo}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col items-center gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">pontuação</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-2">
						<p>
							Os dados presentes nesta seção não necessariamente fazem parte do cálculo da Média
							360º.
						</p>
					</div>
				</div>
			</div>
			<button
				onclick={() => (cultureInfo = false)}
				class="bg-primary text-secondary w-fit rounded-lg p-3"
			>
				Fechar
			</button>
		</div>
	</div>
{/if}
