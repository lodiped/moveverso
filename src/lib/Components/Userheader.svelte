<script lang="ts">
	import { getBandColor, getBandName } from '$lib/currentUser.svelte';
	import { titlesfem, titles, role } from '$lib/state.svelte';
	import movesports from '$lib/assets/sports.png';
	import nomovesports from '$lib/assets/nosports.png';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	// @ts-ignore
	import Pulseira from 'virtual:icons/fa-solid/ring';
	import { untrack } from 'svelte';
	let { user, sector, imgsrc } = $props();

	let cultureInfo = $state(false);
	let progressoInfo = $state(false);

	let firstname = $state('');
	let lastname = $state('');

	let bandList = $state(false);

	$effect(() => {
		[firstname, lastname] = user.name.split(' ');
		console.log(
			'$effect in Userheader.svelte component getting user.name: ' + untrack(() => user.name)
		);
		console.log(
			'$effect in Userheader.svelte component getting user.name ' + untrack(() => user.cultura)
		);
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
						style={`width: ${user.current / (sector === 'bpo' ? 120 : 15)}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p>
						<span class="opacity-50">Pontos na fase:</span>
						<span>{user.current}</span>
					</p>
					<p>
						<span class="opacity-50">p/ próxima:</span>
						<span>{(sector === 'bpo' ? 12000 : 1500) - user.current}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full items-center justify-start gap-3">
			<div class="bg-primary/20 flex w-20 flex-col items-center rounded-lg backdrop-blur-xs">
				<p class="py-1.5 font-bold">
					<span class="text-accent drop-shadow-accent/70 text-3xl drop-shadow-[0_0_5px]"
						>{user.nivel}</span
					>
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
						class="drop-shadow-accent/70 bg-accent absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
						style={`width: ${user.xp / (sector === 'bpo' ? 12 : 1.5)}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p><span class="opacity-50">Pontos no nível:</span> <span>{user.xp}</span></p>
					<p>
						<span class="opacity-50">p/ próximo:</span>
						<span>{(sector === 'bpo' ? 1200 : 150) - user.xp}</span>
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
				{#if user.cultura.media !== 0 && (role.value === 'admin' || role.value === 'cultura' || role.value === 'contabil' || role.value === 'bpo')}
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
					<div class="group flex w-full flex-col items-center">
						<div class="drop-shadow-accent/50 drop-shadow-[0_0_20px]">
							<button
								onclick={() => {
									console.log('show pulseiras');
								}}
								class="flex cursor-pointer flex-col items-center gap-1 drop-shadow-md drop-shadow-black"
							>
								<Pulseira
									style={`color: ${getBandColor(user.ingressMs)};`}
									class="-rotate-45 text-4xl"
								/>
								<div class="text-sm font-bold">{getBandName(user.ingressMs)}</div>
							</button>
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
	</div>
</div>

{#if cultureInfo}
	<div class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/30 px-2">
		<div
			class="bg-secondary/30 flex w-full max-w-[1000px] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			<h2 class="text-center">pontuação</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-2">
						<button class="bg-secondary rounded-xl p-2 px-4" onclick={() => (bandList = !bandList)}>
							Lista das Cores das Pulseiras
						</button>
						<div class="transition-all {bandList ? 'max-h-100' : 'max-h-0 opacity-0'}">
							<ul
								class="pointer-events-none flex flex-col gap-1 text-center text-sm *:rounded-full *:px-4"
							>
								<li class="bg-white text-black">3 meses</li>
								<li class="bg-[#fff200] text-black">1 ano</li>
								<li class="bg-gray-400 text-black">2 anos</li>
								<li class="bg-orange-500 text-black">3 anos</li>
								<li class="bg-emerald-600 text-black">4 anos</li>
								<li class="bg-blue-600 text-white">5 anos</li>
								<li class="bg-purple-600 text-white">6 anos</li>
								<li class="bg-yellow-800 text-white">7 anos</li>
								<li class="bg-black text-[#fff200]">8 anos</li>
								<li class="bg-red-500 text-black">9 anos</li>
								<li class="bg-red-500 text-white">10 anos</li>
								<li class="bg-red-500 text-[#fff200]">10 anos</li>
							</ul>
						</div>
						<h3>Presença</h3>
						<p>
							A melhoria contínua é um dos valores da Move e, sendo assim, a presença nos
							treinamentos e cumbucas de cada colaborador é notada.
						</p>
						<h3>Move Sports</h3>
						<p>
							A atividade física é uma ferramenta fundamental para a saúde mental e física. Com a
							participação no Move Sports conseguimos assegurar que todos os colaboradores que
							participem deem esse pontapé inicial na melhoria das suas vidas.
						</p>
						<h3>Move Coin</h3>
						<p>
							A Move Coin é um meio de representar fisicamente nossa gratidão pela colaboração dos
							nossos colegas. O acúmulo de Coins vale premiações variadas.
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
			class=" bg-secondary/30 flex max-w-[1000px] flex-col items-center gap-10 rounded-xl p-5 backdrop-blur lg:p-10"
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
								>. Ao completar o nível 10, você passa de fase.
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
