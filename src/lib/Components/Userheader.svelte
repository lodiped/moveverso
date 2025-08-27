<script lang="ts">
	import { getBandColor, getBandName } from '$lib/currentUser.svelte';
	import { titlesfem, titles, role } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';
	import movesports from '$lib/assets/sports.png';
	import nomovesports from '$lib/assets/nosports.png';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	// @ts-ignore
	import Pulseira from 'virtual:icons/fa-solid/ring';
	// @ts-ignore
	import Close from 'virtual:icons/mdi/close-circle-outline';
	// @ts-ignore
	import Heart from 'virtual:icons/mdi/heart';
	// @ts-ignore
	import OutlineHeart from 'virtual:icons/mdi/heart-outline';
	// @ts-ignore
	import Bulb from 'virtual:icons/mdi/lightbulb-on-outline';
	import { untrack } from 'svelte';
	let { user, sector, imgsrc, pulseirasrc } = $props();

	let ideaHover = $state(false);

	let cultureInfo = $state(false);
	let progressoInfo = $state(false);
	let progressoTab = $state(0);
	let conquistasInfo = $state(false);

	let toastOpen = $state(false);
	let toastText = $state('');

	let toastTimeout: any;

	function currentToast() {
		toastTimeout = setTimeout(() => {
			toastOpen = false;
			toastText = '';
		}, 3000);
	}

	let firstname = $state('');
	let lastname = $state('');

	let pulseirasInfo = $state(false);
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

<div class="flex w-full justify-center p-5">
	<p
		class="flex w-fit animate-pulse items-center gap-4 rounded-xl border border-red-400/75 bg-red-400/30 p-4 px-4 text-red-400/75"
	>
		<Info class="w-1/5 text-2xl text-red-400/75 md:w-auto" />
		<span>Dados iniciais incompletos. Aguarde atualização em breve.</span>
	</p>
</div>
<div
	class="flex flex-col items-center justify-center gap-5 px-8 md:flex-row md:items-start md:px-0"
>
	<div
		class="relative flex w-[230px] grow-0 flex-col items-center justify-center gap-4 md:w-1/3 md:min-w-[230px]"
	>
		{#if imgsrc}
			<div class="relative w-full">
				<img src={imgsrc} alt="Arte do Personagem" class="rounded-3xl" />
				<img src={pulseirasrc} class="absolute top-0 z-40" alt="" />
			</div>
		{/if}
		{#if role.value && role.value !== 'guest'}
			<div class="absolute -top-6 left-0 z-50 flex w-full items-center justify-center">
				<a
					href="https://form.respondi.app/pj63YtYc"
					target="_blank"
					class=" text-accent drop-shadow-accent flex animate-bounce items-center justify-center gap-2 rounded-xl p-2 drop-shadow-[0_0_4px] transition-all"
					onpointerenter={() => (ideaHover = true)}
					onpointerleave={() => (ideaHover = false)}
				>
					<Bulb class="text-2xl" />
					{#if ideaHover}
						<span
							transition:slide={{ duration: 200, axis: 'x' }}
							class="text-nowrap break-keep transition-all">Formalize sua ideia</span
						>
					{/if}
				</a>
			</div>
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
		</div>
		<div class="absolute top-90 flex w-full flex-col items-center pt-5">
			<div class="relative h-2.5 w-4/5 rounded-md bg-black">
				<div
					class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
					style={`width: ${sector === 'bpo' ? user.total / 1200 : user.total / 75}%;`}
				></div>
				<p
					class="text-primary/50 absolute flex h-full w-full items-center justify-center text-[0.55rem]"
				>
					progresso total
				</p>
			</div>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-2">
			{#if user.conquistas?.length > 0}
				<div class="grid grid-cols-3 gap-4">
					{#each user.conquistas as conquista}
						{#if conquista.number > 0}
							<button
								class=" inline-block w-full cursor-pointer text-center align-top"
								onclick={() => {
									if ((toastOpen = true)) {
										clearTimeout(toastTimeout);
										toastOpen = false;
										toastText = '';
										setTimeout(() => {
											toastOpen = true;
											toastText = conquista.desc;
											currentToast();
										}, 200);
									} else {
										toastOpen = true;
										toastText = conquista.desc;
										currentToast();
									}
								}}
							>
								<div
									title={conquista.desc}
									class="drop-shadow-accent/70 flex flex-col justify-start text-4xl drop-shadow-[0_0_20px] hover:scale-105"
								>
									<p class="drop-shadow-md drop-shadow-black">
										{conquista.img}
									</p>
									{#if conquista.number > 1}
										<span class="text-lg opacity-50">{conquista.number}x</span>
									{/if}
								</div>
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
		<button
			class="bg-primary/30 hover:bg-primary/50 w-2/3 cursor-pointer rounded-lg p-2 text-sm text-white/75 transition-colors"
			onclick={() => {
				conquistasInfo = true;
				console.log(user.conquistas);
			}}>Ver conquistas</button
		>
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
			<div class="bg-primary/20 flex w-20 flex-col items-center justify-between rounded-lg">
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
						<span>{Math.round(user.current)}</span>
					</p>
					<p>
						<span class="opacity-50">p/ próxima:</span>
						<span>{Math.round((sector === 'bpo' ? 12000 : 1500) - user.current)}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full items-center justify-start gap-3">
			<div class="bg-primary/20 flex w-20 flex-col items-center rounded-lg">
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
					<p><span class="opacity-50">Pontos no nível:</span> <span>{Math.round(user.xp)}</span></p>
					<p>
						<span class="opacity-50">p/ próximo:</span>
						<span>{Math.round((sector === 'bpo' ? 1200 : 150) - user.xp)}</span>
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
					class="bg-secondary group relative h-4 w-full rounded-md"
					title={user.cultura ? user.cultura.presenca.treinamento : ''}
				>
					<div
						class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
						style={`width: ${user.cultura ? user.cultura.presenca.treinamento : ''}%;`}
					>
						{#if user.cultura}
							<span
								class="pr-2 text-xs font-bold text-black opacity-50 {user.cultura.presenca
									.treinamento < 20
									? 'hidden'
									: ''}">Treinamentos</span
							>
						{/if}
					</div>
					<div
						class="pointer-events-none absolute bottom-0 z-50 flex h-[98%] w-full items-center justify-center text-sm opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="w-fit">{user.cultura ? user.cultura.presenca.treinamento : ''}%</div>
					</div>
				</div>
				<div
					class="bg-secondary group relative h-4 w-full rounded-md"
					title={user.cultura ? user.cultura.presenca.cumbuca : ''}
				>
					<div
						class="absolute top-0 left-0 flex h-full w-full items-center justify-end rounded-md bg-[slateblue] drop-shadow-[0_0_10px] drop-shadow-[slateblue]/70 transition-all content-['']"
						style={`width: ${user.cultura ? user.cultura.presenca.cumbuca : ''}%;`}
					>
						<span
							class="pr-2 text-xs font-bold text-black opacity-50 {user.cultura.presenca.cumbuca <
							20
								? 'hidden'
								: ''}">Cumbuca</span
						>
					</div>
					<div
						class="pointer-events-none absolute bottom-0 z-50 flex h-[98%] w-full items-center justify-center text-sm opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="w-fit">{user.cultura ? user.cultura.presenca.cumbuca : ''}%</div>
					</div>
				</div>
			</div>
			<div class="flex w-full items-center justify-between">
				{#if user.cultura && user.cultura.media !== 0 && (role.value === 'admin' || role.value === 'cultura' || role.value === 'contabil' || role.value === 'bpo')}
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
									pulseirasInfo = true;
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
					class="group flex w-full flex-col items-center justify-between gap-3.5 drop-shadow-[0_0_20px] drop-shadow-red-600"
				>
					<div
						class="pointer-events-none absolute flex h-full -translate-y-10 items-center justify-center opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
					>
						Pontos: {user.cultura ? user.cultura.sports.pontos : ''}
					</div>
					<div
						class="flex max-w-35 flex-col items-center justify-between gap-3.5 transition-all group-hover:translate-y-10 group-hover:opacity-0"
					>
						{#if user.cultura && user.cultura.sports.presente}
							<img src={movesports} class="w-[50%]" alt="" />
							<div class="flex text-red-500">
								{#if user.cultura.sports.hp === 3}
									<Heart /><Heart /><Heart />
								{:else if user.cultura.sports.hp === 2}
									<Heart /><Heart /><OutlineHeart />
								{:else}
									<Heart /><OutlineHeart /><OutlineHeart />
								{/if}
							</div>
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
						<p class="text-sm">Recebidas: {user.cultura ? user.cultura.coins.recebidas : ''}</p>
						<p class="text-sm">Entregues: {user.cultura ? user.cultura.coins.entregues : ''}</p>
					</div>
					<div
						class="pointer-events-none drop-shadow-md drop-shadow-black transition-all group-hover:translate-y-10 group-hover:opacity-0"
					>
						<div class="hexagon bg-accent/80 flex h-12 items-center justify-center">
							<div
								class="hexagon bg-secondary text-accent flex h-10 cursor-default items-center justify-center text-xl font-bold"
							>
								{user.cultura ? user.cultura.coins.recebidas : ''}
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
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (cultureInfo = false)}
		class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/30 px-2"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative flex max-h-[85vh] w-full max-w-[1000px] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			<h2 class="text-center">pontuação</h2>
			<div class="flex flex-col items-center gap-5 overflow-auto">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-2">
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
				class="text-primary absolute top-3 right-3 cursor-pointer rounded-full text-2xl"
			>
				<Close />
			</button>
		</div>
	</div>
{/if}

{#if progressoInfo}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (progressoInfo = false)}
		class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/30 p-5 px-5 text-sm lg:px-20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class=" bg-secondary/30 relative flex max-h-[85vh] max-w-[1000px] flex-col items-center gap-10 rounded-xl p-5 pt-8 backdrop-blur lg:p-10"
		>
			<div class="flex w-full items-center justify-center gap-2 px-4">
				<button
					onclick={() => (progressoTab = 0)}
					class="border-accent w-1/2 pb-2 text-center text-lg font-bold {progressoTab === 0
						? 'border-b-2'
						: 'cursor-pointer opacity-30 hover:border-b-2'}">O Jogo</button
				>
				<button
					onclick={() => (progressoTab = 1)}
					class="border-accent w-1/2 pb-2 text-center text-lg font-bold {progressoTab === 1
						? 'border-b-2'
						: 'cursor-pointer opacity-30 hover:border-b-2'}">Pontuação</button
				>
			</div>
			<div class="flex flex-col items-center gap-5 overflow-auto">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-5">
						{#if progressoTab === 0}
							<div class="flex flex-col items-center">
								<p>
									Bem-vindo(a) ao Moveverso! Aqui você vai acompanhar o seu progresso no jogo. O
									jogo consiste em acumular pontos. Para completar o jogo, você vai acumular {#if sector === 'bpo'}<span
											class="text-accent">60000</span
										>{:else}<span class="text-accent">7500</span>{/if}
									pontos no total. Durante o jogo, você vai passar por diversas
									<span class="text-accent">fases</span>
									e <span class="text-accent">níveis</span>.
								</p>
							</div>
							<div class="flex flex-col items-center">
								<h3>Fases</h3>
								<p>
									O jogo completo consiste de <span class="text-accent">5 fases</span>. Para passar
									cada fase, você precisa acumular {#if sector === 'bpo'}<span class="text-accent"
											>12000 pontos</span
										>{:else}<span class="text-accent">1500 pontos</span>{/if}. Durante o acúmulo
									desses pontos na fase, você vai passar por
									<span class="text-accent">10 níveis</span>. Ou seja,
									<span class="text-accent font-bold">a cada 10 níveis, você passa de fase.</span>
								</p>
							</div>
							<div class="flex flex-col items-center">
								<h3>Níveis</h3>
								<p>
									Como cada fase possui 10 níveis, para subir de nível você precisa acumular {#if sector === 'bpo'}<span
											class="text-accent">1200 pontos</span
										>{:else}<span class="text-accent">150 pontos</span>{/if}. Ao completar o nível
									10, você passa de fase.
								</p>
							</div>
						{:else if sector === 'bpo'}
							<p class="font-bold">Tarefas:</p>
							<ul class="w-full space-y-2">
								<li>
									&bull; Fechamento: Se entregue no dia 1: 10 pontos, a cada dia depois a pontuação
									a ser ganha diminui 1 ponto.
								</li>
								<li>
									&bull; Tempo gasto por empresa: Média dos minutos gastos de cada empresa / 30.
									Valor mínimo de 330 pontos. Sujeito a feedback caso não seja alcançado.
								</li>
								<li>
									&bull; Diminuição do tempo gasto: Performance do mês anterior - mês atual / mês
									anterior * 100. Pode ganhar até 30 pontos.
								</li>
								<li>&bull; Honorários: Valor total dos honorários / 100</li>
								<li>&bull; Emissão do boleto Conta Azul (indicação): 20 pontos</li>
								<li>&bull; Plataforma PlayBPO em dia: 30 pontos</li>
								<li>&bull; Elogio de cliente: 10 pontos</li>
								<li>&bull; Primeiro lugar: 30 pontos</li>
								<li>&bull; Segundo lugar: 15 pontos</li>
							</ul>
							<p class="font-bold">Falhas:</p>
							<ul class="w-full space-y-2">
								<li>&bull; Fechamentos após dia 10: de -2 até -6 pontos</li>
								<li>
									&bull; Aumento do tempo gasto: Performance do mês anterior - mês atual / mês
									anterior * 100. Pode perder até -20 pontos
								</li>
								<li>&bull; Plataforma PlayBPO incorreta: -30 pontos</li>
								<li>&bull; Reclamação de cliente: -10 pontos</li>
								<li>&bull; Não envio de vencimentos ou pagamentos: -5 pontos</li>
								<li>
									&bull; Prejuízo financeiro por erro cometido: -1 ponto por R$10,00 de prejuízo
								</li>
							</ul>
						{:else}
							<p class="font-bold">Tarefas:</p>
							<ul class="w-full space-y-2">
								<li>
									&bull; A partir de 70% das tarefas concluídas você pode ganhar de 30 a 100 pontos
								</li>
								<li class="text-accent font-bold">
									Formalize nas anotações do Gestta as justificativas das atividades que impedem a
									conclusão das suas tarefas diárias para podermos contabilizar de forma justa as
									pontuações.
								</li>
								<li>
									&bull; Controle de atividades devidamente atualizado ao final do mês: 30 pontos
								</li>
								<li>&bull; Elogio de cliente: 10 pontos</li>
								<li>&bull; Ideia de melhoria: 10 pontos</li>
								<li>&bull; Maior número de ideias no mês: 15 pontos</li>
								<li>&bull; Indicação de cliente que fecha negócio: 100 pontos</li>
								<li>&bull; Atualização profissional: 1 ponto por hora de curso</li>
							</ul>
							<p class="font-bold">Falhas:</p>
							<ul class="w-full space-y-2">
								<li>&bull; Reclamação de cliente: -10 pontos</li>
								<li>&bull; Erro cometido: -10 pontos</li>
								<li>&bull; Prejuízo financeiro por erro: -1 ponto por R$ custado.</li>
							</ul>
						{/if}
					</div>
				</div>
			</div>
			<button
				onclick={() => (progressoInfo = false)}
				class="text-primary absolute top-3 right-3 cursor-pointer rounded-full text-2xl"
			>
				<Close />
			</button>
		</div>
	</div>
{/if}

{#if pulseirasInfo}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (pulseirasInfo = false)}
		class="fixed top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/30"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative flex flex-col items-center gap-5 rounded-xl p-10 backdrop-blur"
		>
			<h3>Pulseiras</h3>
			<ul class="pointer-events-none flex flex-col gap-1 text-center text-sm *:rounded-full *:px-4">
				<li class="bg-white text-black">3 meses</li>
				<li class="bg-[#fff200] text-black">1 ano</li>
				<li class="bg-[#99a1af] text-black">2 anos</li>
				<li class="bg-[#f97316] text-black">3 anos</li>
				<li class="bg-[#059669] text-black">4 anos</li>
				<li class="bg-[#155dfc] text-white">5 anos</li>
				<li class="bg-[#9810fa] text-white">6 anos</li>
				<li class="bg-[#854d0e] text-white">7 anos</li>
				<li class="bg-black text-[#fff200]">8 anos</li>
				<li class="bg-[#fb2c36] text-black">9 anos</li>
				<li class="bg-[#fb2c36] text-white">10 anos</li>
				<li class="bg-[#fb2c36] text-[#fff200]">11 anos</li>
			</ul>
			<button
				class="text-primary absolute top-3 right-3 cursor-pointer rounded-full text-2xl"
				onclick={() => (pulseirasInfo = false)}><Close /></button
			>
		</div>
	</div>
{/if}

{#if conquistasInfo}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (conquistasInfo = false)}
		class="fixed top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/30"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative flex flex-col items-center gap-5 rounded-xl p-10 backdrop-blur"
		>
			<h3>Conquistas</h3>
			<div
				class="grid cursor-default grid-cols-4 grid-rows-2 gap-5 text-center text-sm *:rounded-full"
			>
				{#each user.conquistas as conquista}
					<button
						onclick={() => {
							if ((toastOpen = true)) {
								clearTimeout(toastTimeout);
								toastOpen = false;
								toastText = '';
								setTimeout(() => {
									toastOpen = true;
									toastText = conquista.desc;
									currentToast();
								}, 200);
							} else {
								toastOpen = true;
								toastText = conquista.desc;
								currentToast();
							}
						}}
						class="cursor-pointer"
					>
						<div
							title={conquista.desc}
							class="text-3xl {conquista.number > 0
								? 'drop-shadow-accent/50 drop-shadow-xl'
								: 'brightness-50 saturate-0'}"
						>
							{conquista.img}
						</div>
						<div class={conquista.number > 0 ? 'text-shadow-[0_0_5px_white]' : 'opacity-50'}>
							{conquista.number}x
						</div>
					</button>
				{/each}
			</div>
			<button
				class="text-primary absolute top-3 right-3 cursor-pointer rounded-full text-2xl"
				onclick={() => (conquistasInfo = false)}><Close /></button
			>
		</div>
	</div>
{/if}

{#if toastOpen}
	<div
		contenteditable="true"
		class="bg-accent/10 text-accent border-accent/40 fixed bottom-0 left-0 z-50 mb-10 ml-10 rounded-xl border p-4 px-5 backdrop-blur"
		transition:slide={{ axis: 'y', duration: 200 }}
	>
		{toastText}
	</div>
{/if}
