<script lang="ts">
	import { getCultura, pulseira, getBandColor, getBandName } from '$lib/currentUser.svelte';
	import { titlesfem, titles, totalConquistas, role } from '$lib/state.svelte';
	import movesports from '$lib/assets/sports.png';
	import nomovesports from '$lib/assets/nosports.png';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	// @ts-ignore
	import Pulseira from 'virtual:icons/fa-solid/ring';
	import CulturaPanel from './CulturaPanel.svelte';
	let { user, imgsrc, toggleSports, setMedia, giveCoin, receiveCoin, setTreinamento, setCumbuca } =
		$props();

	let cultureInfo = $state(false);
	let progressoInfo = $state(false);

	let firstname = $state('');
	let lastname = $state('');

	$effect(() => {
		[firstname, lastname] = user.name.split(' ');
		console.log(user.name);
		console.log(user.cultura);
	});
</script>

<div
	class="flex flex-col items-center justify-center gap-5 px-8 md:flex-row md:items-start md:px-0"
>
	<div
		class="relative flex w-[230px] grow-0 flex-col items-center justify-center gap-4 md:w-1/3 md:min-w-[230px]"
	>
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
			<span class="drop-shadow-[0_0_2px] drop-shadow-black">
				ingresso: {user.ingress}
			</span>
			{#if getBandColor(user.ingressMs)}
				<span>
					<Pulseira class="-rotate-45" style={`color: ${getBandColor(user.ingressMs)};`} /></span
				>
			{/if}
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
		<div class="-mb-4 flex w-full justify-center">
			<h3 class="relative">
				PROGRESSO
				<button
					onclick={() => {
						progressoInfo = !progressoInfo;
					}}
					class="absolute right-0 bottom-0 translate-x-5.75 -translate-y-2 cursor-pointer text-white opacity-50 transition-opacity hover:opacity-100"
				>
					<Info class="text-base" />
				</button>
			</h3>
		</div>
		<div class="flex w-full items-center justify-start gap-3">
			<div
				class="bg-primary/20 flex w-20 flex-col items-center justify-between rounded-lg backdrop-blur-xs"
			>
				<p class="flex items-end py-1.5 font-bold">
					<span class="drop-shadow-accent/70 text-accent text-3xl drop-shadow-[0_0_5px]"
						>{user.fase}</span
					><span class="text-primary">/5</span>
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
			<div class="bg-primary/20 flex w-20 flex-col items-center rounded-lg backdrop-blur-xs">
				<p class="py-1.5 font-bold">
					<span class="text-accent drop-shadow-accent/70 text-3xl drop-shadow-[0_0_5px]"
						>{user.nivel}</span
					><span class="text-primary">/10</span>
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
			<div class="flex w-full flex-col items-center gap-2">
				<div
					class="bg-secondary relative h-4 w-full rounded-md"
					title={user.cultura.presenca.treinamento}
				>
					<div
						class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
						style={`width: ${user.cultura.presenca.treinamento}%;`}
					>
						<span
							class="pr-2 text-xs font-bold text-black opacity-50 {user.cultura.presenca
								.treinamento < 20
								? 'hidden'
								: ''}">Treinamentos</span
						>
					</div>
				</div>
				<div
					class="bg-secondary relative h-4 w-full rounded-md"
					title={user.cultura.presenca.cumbuca}
				>
					<div
						class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
						style={`width: ${user.cultura.presenca.cumbuca}%;`}
					>
						<span
							class="pr-2 text-xs font-bold text-black opacity-50 {user.cultura.presenca.cumbuca <
							20
								? 'hidden'
								: ''}">Cumbuca</span
						>
					</div>
				</div>
			</div>
			<div class="flex w-full items-center justify-between">
				{#if user.cultura.media !== 0}
					<div
						class="drop-shadow-accent flex w-full flex-col items-center gap-1 drop-shadow-[0_0_20px]"
					>
						<p class="text-accent my-1 text-3xl font-bold drop-shadow-sm drop-shadow-black">
							{user.cultura.media}
						</p>
						<p class="text-sm font-bold">Média 360º</p>
					</div>
				{/if}
				{#if getBandColor(user.ingressMs)}
					<div class="group relative flex w-full flex-col items-center transition-all">
						<div
							class="drop-shadow-accent/50 pointer-events-none absolute -translate-y-10 opacity-0 drop-shadow-[0_0_20px] transition-all group-hover:translate-y-0 group-hover:opacity-100"
						>
							<div class="flex flex-col items-center gap-1 drop-shadow-md drop-shadow-black">
								<Pulseira
									style={`color: ${getBandColor(user.ingressMs)};`}
									class="-rotate-45 text-4xl"
								/>
								<div class="text-sm font-bold">Próxima</div>
							</div>
						</div>
						<div
							class="drop-shadow-accent/50 pointer-events-none drop-shadow-[0_0_20px] transition-all group-hover:translate-y-10 group-hover:opacity-0"
						>
							<div class="flex flex-col items-center gap-1 drop-shadow-md drop-shadow-black">
								<Pulseira
									style={`color: ${getBandColor(user.ingressMs)};`}
									class="-rotate-45 text-4xl"
								/>
								<div class="text-sm font-bold">{getBandName(user.ingressMs)}</div>
							</div>
						</div>
					</div>
				{/if}
				<div
					class="flex w-full flex-col items-center justify-between gap-3.5 drop-shadow-[0_0_20px] drop-shadow-red-600"
				>
					<div class="flex flex-col items-center justify-between gap-3.5">
						{#if user.cultura.sports.presente}
							<img src={movesports} class="w-[50%]" alt="" />
							<p class="text-sm font-bold">Ativo</p>
						{:else}
							<img src={nomovesports} class="w-[50%]" alt="" />
							<p class="text-sm font-bold">Inativo</p>
						{/if}
					</div>
				</div>
				<div
					class="drop-shadow-accent/40 group relative flex w-full flex-col items-center justify-center gap-1 drop-shadow-[0_0_20px] transition-all"
				>
					<div
						class="pointer-events-none absolute top-0 right-0 flex h-full w-full -translate-y-10 cursor-default flex-col items-center justify-center opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
					>
						<p class="text-sm">Recebidas: {user.cultura.coins.recebidas}</p>
						<p class="text-sm">Entregues: 8</p>
					</div>
					<div
						class="pointer-events-none drop-shadow-md drop-shadow-black transition-all group-hover:translate-y-10 group-hover:opacity-0"
					>
						<div class="hexagon bg-accent/80 flex h-12 items-center justify-center">
							<div
								class="hexagon bg-secondary text-accent flex h-10 cursor-default items-center justify-center text-xl font-bold"
							>
								{user.cultura.coins.recebidas}
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
		</div>
		{#if role.value === 'cultura'}
			<CulturaPanel
				bind:user
				{toggleSports}
				{giveCoin}
				{receiveCoin}
				{setMedia}
				{setTreinamento}
				{setCumbuca}
			/>
		{/if}
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

{#if progressoInfo}
	<div
		class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/30 px-5 text-sm lg:px-20"
	>
		<div
			class="bg-secondary/30 flex flex-col items-center gap-10 rounded-xl p-5 backdrop-blur lg:p-10"
		>
			<h2 class="text-center">pontuação</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-5">
						<div class="flex flex-col items-center">
							<p>
								Bem-vindo(a) ao Moveverso! Aqui você vai acompanhar o seu progresso no jogo. O jogo
								consiste em acumular pontos. Para completar o jogo, você vai acumular <span
									class="text-accent">7500</span
								>
								pontos no total. Durante o jogo, você vai passar por diversas
								<span class="text-accent">fases</span>
								e <span class="text-accent">níveis</span>.
							</p>
						</div>
						<div class="flex flex-col items-center">
							<h3>Fases</h3>
							<p>
								O jogo completo consiste de <span class="text-accent">5 fases</span>. Para passar
								cada fase, você precisa acumular <span class="text-accent">1500 pontos</span>.
								Durante o acúmulo desses pontos na fase, você vai passar por
								<span class="text-accent">10 níveis</span>. Ou seja,
								<span class="text-accent font-bold">a cada 10 níveis, você passa de fase.</span>
							</p>
						</div>
						<div class="flex flex-col items-center">
							<h3>Níveis</h3>
							<p>
								Como cada fase possui 10 níveis, para subir de nível você precisa acumular <span
									class="text-accent">150 pontos</span
								>. Ao chegar no nível 10, você passa de fase.
							</p>
						</div>
					</div>
				</div>
			</div>
			<button
				onclick={() => (progressoInfo = false)}
				class="bg-primary text-secondary w-fit rounded-lg p-3"
			>
				Fechar
			</button>
		</div>
	</div>
{/if}
