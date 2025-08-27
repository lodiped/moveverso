<script lang="ts">
	// @ts-ignore
	import Save from 'virtual:icons/mdi/floppy';
	// @ts-ignore
	import ThumbsUp from 'virtual:icons/mdi/thumbs-up';
	// @ts-ignore
	import ThumbsDn from 'virtual:icons/mdi/thumbs-down';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	import { page } from '$app/state';
	import { derived } from 'svelte/store';
	import { role } from '$lib/state.svelte';
	let {
		loading,
		addPoints = $bindable(),
		addConquista = $bindable(),
		clearConquistas = $bindable(),
		erroModal = $bindable(),
		clearLog,
		user
	} = $props();

	let preju: number | undefined = $state();
	let prejuFinal = $derived(preju! / 10);

	let honorario: number | undefined = $state();
	let honorarioFinal: number = $derived(honorario! / 100);

	let diaFechamento: number | undefined = $state();
	function diaFechamentoPoints(n: number) {
		if (typeof diaFechamento !== 'number') {
			return;
		}
		if (n === 1) return 10;
		if (n === 2) return 9;
		if (n === 3) return 8;
		if (n === 4) return 7;
		if (n === 5) return 6;
		if (n === 6) return 5;
		if (n === 7) return 4;
		if (n === 8) return 3;
		if (n === 9) return 2;
		if (n === 10) return 1;
		if (n === 11) return 0;
		if (n === 12) return -1;
		if (n === 13) return -2;
		if (n === 14) return -3;
		if (n === 15) return -4;
		if (n > 15) return -5;
	}

	let tempoGasto: number | undefined = $state();
	let tempoGastoPoints = $derived(tempoGasto! / 30);

	let deltaTempoUp: number | undefined = $state();
	let deltaTempoDown: number | undefined = $state();
	function deltaTempoFn(n: number) {
		if (typeof n !== 'number') return;
		if (n < -30) return -20;
		if (n < -20 && n >= -30) return -10;
		if (n < -10 && n >= -20) return -5;
		if (n >= -10 && n <= 0) return 0;
		if (n > 0 && n <= 10) return 5;
		if (n > 10 && n <= 20) return 10;
		if (n > 20 && n <= 30) return 20;
		if (n > 30) return 30;
	}

	let cost: number = $state(0);
	let horas = $state(0);
	let dangerZoneAll = $state(false);
	let estudoModal = $state(false);
	let controleAtv: number | undefined = $state();
	let atualizacaoProfissional: number | undefined = $state();
	let contabilPreju: number | undefined = $state();

	let section = $derived(page.url.pathname.split('/')[1]);
</script>

<h2 class="w-full text-center">Admin</h2>
{#if section === 'contabil' && (role.value === 'contabil' || role.value === 'admin')}
	<div class="flex w-full flex-col gap-5 px-2 lg:px-0">
		<div class="w-full">
			<div
				class=" {loading
					? 'pointer-events-none cursor-default opacity-50'
					: ''} flex w-full flex-col gap-3 *:w-full"
			>
				<p class="text-center">Tarefas:</p>
				<div class="flex gap-3">
					<button
						onclick={() => addPoints(30, user.id, 'tarefas70', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						70% <span class="text-green-600">+30</span></button
					>
					<button
						onclick={() => addPoints(50, user.id, 'tarefas80', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						80% <span class="text-green-600">+50</span></button
					>
					<button
						onclick={() => addPoints(70, user.id, 'tarefas90', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						90% <span class="text-green-600">+70</span></button
					>
					<button
						onclick={() => {
							addPoints(100, user.id, 'tarefas100', 'point');
							addConquista('conqmestarefa', user.id);
						}}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
						>100% <span class="text-green-600">+100</span></button
					>
				</div>
				<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
					<input
						type="number"
						class=" w-full appearance-none rounded-lg border-0 bg-transparent"
						placeholder="Controle de Atividades atualizado (até 30 pontos)"
						bind:value={controleAtv}
					/>
					<button
						class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
						><Info /></button
					>
					<button
						class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {controleAtv
							? 'cursor-pointer'
							: 'pointer-events-none cursor-default opacity-50'}"
						onclick={() => {
							if (controleAtv! >= 30) {
								addConquista('conqmesplanilha', user.id);
							}
							addPoints(controleAtv, user.id, 'controleAtv', 'point');
						}}><Save /><span>Salvar</span></button
					>
				</div>
				<p class="text-center">Ideias de melhoria:</p>
				<div class="flex gap-3">
					<button
						onclick={() => addPoints(5, user.id, 'ideia', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						Ideia de melhoria <span class="text-green-600">+10</span>
					</button>
					<button
						onclick={() => addPoints(10, user.id, 'maiorideia', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						Maior número <span class="text-green-600">+15</span>
					</button>
					<button
						onclick={() => {
							addPoints(15, user.id, 'melhorideia', 'point');
							addConquista('conqmesideia', user.id);
						}}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						Melhor ideia <span class="text-green-600">+20</span>
					</button>
				</div>
				<p class="text-center">Clientes:</p>
				<div class="flex gap-3">
					<button
						onclick={() => addPoints(-10, user.id, 'reclamacao', 'point')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						Reclamação de cliente <span class="text-red-500">-10</span>
					</button>
					<button
						onclick={() => {
							addPoints(10, user.id, 'elogio', 'point');
							addConquista('conqelogio', user.id);
						}}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>
						Elogio do cliente <span class="text-green-600">+10</span></button
					>
				</div>
				<button
					onclick={() => addPoints(15, user.id, 'indicacao', 'point')}
					class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
				>
					Indicação de cliente <span class="text-green-600">+100</span>
				</button>
				<p class="text-center">Profissionalização:</p>
				<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
					<input
						type="number"
						class=" w-full appearance-none rounded-lg border-0 bg-transparent"
						placeholder="Atualização Profissional (horas)"
						bind:value={atualizacaoProfissional}
					/>
					<button
						class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
						><Info /></button
					>
					<button
						disabled={typeof atualizacaoProfissional !== 'number' || atualizacaoProfissional <= 0}
						class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {atualizacaoProfissional
							? ''
							: 'pointer-events-none opacity-50'}"
						onclick={() => addPoints(atualizacaoProfissional, user.id, 'horacurso', 'point')}
						><Save /><span>Salvar</span></button
					>
				</div>
				<p class="text-center">Erros:</p>
				<button
					onclick={() => addPoints(-10, user.id, 'erro', 'point')}
					class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
				>
					Erro cometido <span class="text-red-500">-10</span>
				</button>
				<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
					<input
						type="number"
						class=" w-full appearance-none rounded-lg border-0 bg-transparent"
						placeholder="Prejuízo financeiro por erro (em R$)"
						bind:value={contabilPreju}
					/>
					<button
						class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
						><Info /></button
					>
					<button
						disabled={typeof contabilPreju !== 'number' || contabilPreju <= 0}
						class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {contabilPreju
							? 'cursor-pointer'
							: 'pointer-events-none cursor-default opacity-50'}"
						onclick={() =>
							addPoints(Math.ceil(-contabilPreju! * 0.1), user.id, 'errovalor', 'point')}
						><Save /><span>Salvar</span></button
					>
				</div>
			</div>
		</div>

		<div class="w-full">
			<h3 class="w-full text-center">Conquistas</h3>
			<div
				class="{loading
					? 'pointer-events-none cursor-default opacity-50'
					: ''} flex w-full flex-col gap-3"
			>
				<button
					onclick={() => addConquista('conqmaiordomes', user.id)}
					class="bg-primary/30 w-full cursor-pointer rounded-xl py-3">Maior pontuação do Mês</button
				>
				<button
					onclick={() => addConquista('conqmaiordoano', user.id)}
					class="bg-primary/30 w-full cursor-pointer rounded-xl py-3">Maior pontuação do Ano</button
				>
				<button
					onclick={() => addConquista('conqformacao', user.id)}
					class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
					>Formação Superior concluída</button
				>
			</div>
			<h3 class="mt-4 w-full text-center text-red-500">Danger Zone</h3>
			<p class="mb-2 w-full text-center text-sm opacity-50">Esta ação exige confirmação:</p>
			<div
				class="*:bg-primary/30 *:backdrop-blur-xs {loading
					? 'pointer-events-none cursor-default opacity-50'
					: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer"
			>
				<button
					onclick={() => (dangerZoneAll = true)}
					class="w-full cursor-pointer rounded-xl !bg-red-500/70 p-3 hover:opacity-50"
				>
					Zerar Tudo!
				</button>
			</div>
		</div>
	</div>
{/if}
{#if section === 'bpo' && (role.value === 'bpo' || role.value === 'admin')}
	<div class="flex w-full flex-col items-center gap-3 px-2 md:px-0">
		<p class="flex items-center gap-2">
			<span>Gerenciamento de Tempo</span>
		</p>
		<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
			<input
				type="number"
				class=" w-full appearance-none rounded-lg border-0 bg-transparent"
				placeholder="Dia do Fechamento"
				bind:value={diaFechamento}
			/>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button
				disabled={diaFechamento == 0}
				class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {diaFechamento
					? ''
					: 'pointer-events-none opacity-50'}"
				onclick={() => {
					if (diaFechamento! < 6) addConquista('conqfechamento', user.id);
					addPoints(diaFechamentoPoints(diaFechamento!), user.id, 'diafechamento', 'point');
				}}><Save /><span>Salvar</span></button
			>
		</div>
		<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
			<input
				type="number"
				class=" w-full appearance-none rounded-lg border-0 bg-transparent"
				placeholder="Tempo Gasto"
				bind:value={tempoGasto}
			/>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button
				class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {tempoGasto
					? ''
					: 'pointer-events-none opacity-50'}"
				onclick={() => addPoints(tempoGastoPoints, user.id, 'tempogasto', 'point')}
				><Save /><span>Salvar</span></button
			>
		</div>
		<div class="flex w-full gap-2">
			<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
				<input
					type="number"
					class=" w-full appearance-none rounded-lg border-0 bg-transparent"
					placeholder="Redução de Tempo (%)"
					bind:value={deltaTempoDown}
				/>
				<button
					onclick={() => addPoints(deltaTempoFn(deltaTempoDown!), user.id, 'delta', 'point')}
					class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {deltaTempoDown
						? ''
						: 'pointer-events-none opacity-50'}"
					><ThumbsUp class="text-green-600 md:text-white" /><span class="hidden md:block"
						>Salvar</span
					></button
				>
			</div>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
				<input
					type="number"
					class=" w-full appearance-none rounded-lg border-0 bg-transparent"
					placeholder="Aumento do Tempo (%)"
					bind:value={deltaTempoUp}
				/>
				<button
					onclick={() => addPoints(deltaTempoFn(-deltaTempoUp!), user.id, 'delta', 'point')}
					class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {deltaTempoUp
						? ''
						: 'pointer-events-none opacity-50'}"
					><ThumbsDn class="text-red-600 md:text-white" /><span class="hidden md:block">Salvar</span
					></button
				>
			</div>
		</div>
		<p class="flex items-center gap-2">
			<span>Processos</span>
		</p>
		<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
			<input
				type="number"
				class="w-full appearance-none rounded-lg border-0 bg-transparent"
				placeholder="Total de Honorários (R$)"
				bind:value={honorario}
			/>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button
				onclick={() => addPoints(honorarioFinal, user.id, 'honorario', 'point')}
				class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {honorario
					? ''
					: 'pointer-events-none opacity-50'}"><Save /><span>Salvar</span></button
			>
		</div>
		<button
			onclick={() => addPoints(20, user.id, 'indicacaoboleto', 'point')}
			class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
			>Emissão de boleto CA (indicação) <span class="text-green-600">+20</span></button
		>
		<div class="flex w-full flex-col items-center gap-2">
			<div class="flex w-full gap-2 *:cursor-pointer">
				<button
					onclick={() => addPoints(-30, user.id, 'playbpodown', 'point')}
					class="bg-primary/30 w-full rounded-xl p-3"
					>PlayBPO incorreto <span class="text-red-500">-30</span></button
				>
				<button
					class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
					><Info /></button
				>
				<button
					onclick={() => {
						addConquista('conqplaybpo', user.id);
						addPoints(30, user.id, 'playbpoup', 'point');
					}}
					class="bg-primary/30 w-full rounded-xl p-3"
					>PlayBPO em dia <span class="text-green-600">+30</span></button
				>
			</div>
		</div>
		<div class="flex w-full flex-col items-center gap-2">
			<div class="flex w-full gap-2 *:cursor-pointer">
				<button
					onclick={() => addPoints(-10, user.id, 'reclamacao', 'point')}
					class="bg-primary/30 w-full rounded-xl p-3"
					>Reclamação de Cliente <span class="text-red-500">-10</span></button
				>
				<button
					class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
					><Info /></button
				>
				<button
					onclick={() => {
						addConquista('conqelogio', user.id);
						addPoints(10, user.id, 'elogio', 'point');
					}}
					class="bg-primary/30 w-full rounded-xl p-3"
					>Elogio de Cliente <span class="text-green-600">+10</span></button
				>
			</div>
		</div>
		<p class="flex items-center gap-2">
			<span>Dinâmicas Internas</span>
		</p>
		<div class="flex w-full flex-col items-center gap-2">
			<div class="flex w-full gap-2 *:cursor-pointer">
				<button
					onclick={() => addPoints(30, user.id, 'primeirolugar', 'point')}
					class="bg-primary/30 w-full rounded-xl py-3"
					>Primeiro Lugar <span class="text-green-600">+30</span></button
				>
				<button
					class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
					><Info /></button
				>
				<button
					onclick={() => addPoints(15, user.id, 'segundolugar', 'point')}
					class="bg-primary/30 w-full rounded-xl py-3"
					>Segundo Lugar <span class="text-green-600">+15</span></button
				>
			</div>
		</div>
		<div class="flex w-full flex-col items-center">
			<div class="flex w-full gap-3 *:cursor-pointer">
				<button
					onclick={() => {
						addConquista('conqideia', user.id);
						addPoints(5, user.id, 'ideiaaplicadabpo', 'point');
					}}
					class="bg-primary/30 w-full rounded-xl p-3"
					>Idéia aplicada <span class="text-green-600">+5</span></button
				>
				<button
					onclick={() => addPoints(50, user.id, 'numeroideiasbpo', 'point')}
					class="bg-primary/30 w-full rounded-xl p-3"
					>Número de idéias <span class="text-green-600">+50</span></button
				>
				<button
					onclick={() => addPoints(50, user.id, 'melhorideiabpo', 'point')}
					class="bg-primary/30 w-full rounded-xl p-3"
					>Melhor idéia <span class="text-green-600">+50</span></button
				>
			</div>
		</div>
		<p class="flex items-center gap-2">
			<span>Falhas</span>
		</p>
		<button
			onclick={() => addPoints(-5, user.id, 'falhaenvio', 'point')}
			class="bg-primary/30 w-full cursor-pointer rounded-xl p-3"
			>Não envio de vencimentos ou pagamentos <span class="text-red-500">-5</span></button
		>
		<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
			<input
				type="number"
				class="w-full appearance-none rounded-lg border-0 bg-transparent"
				placeholder="Prejuízo (em R$)"
				bind:value={preju}
			/>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button
				onclick={() => addPoints(-prejuFinal, user.id, 'prejuizo', 'point')}
				class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2 {preju
					? ''
					: 'pointer-events-none opacity-50'}"><Save /><span>Salvar</span></button
			>
		</div>

		<h3>Conquistas</h3>
		<button
			onclick={() => addConquista('conq3fechamento', user.id)}
			class="bg-primary/30 w-full cursor-pointer rounded-xl p-3"
			>3 meses de fechamento antes do dia 05</button
		>
		<button
			onclick={() => addConquista('conqedu', user.id)}
			class="bg-primary/30 w-full cursor-pointer rounded-xl p-3">Mês com educação continuada</button
		>
		<p class="font-bold text-red-500 uppercase drop-shadow-lg drop-shadow-red-500/50">
			Danger Zone
		</p>
		<button
			onclick={() => (dangerZoneAll = !dangerZoneAll)}
			class="w-full cursor-pointer rounded-xl bg-red-500 p-3"
		>
			Zerar Tudo
		</button>
	</div>
{/if}

{#if dangerZoneAll}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">Tem certeza?</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-2">
						<p>Esta ação irá zerar todos os pontos desta pessoa</p>
					</div>
				</div>
				<button
					onclick={() => {
						clearLog(user.id), (dangerZoneAll = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50"
				>
					Apagar Tudo
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (dangerZoneAll = false)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}
