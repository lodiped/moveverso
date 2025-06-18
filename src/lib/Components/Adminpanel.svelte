<script lang="ts">
	// @ts-ignore
	import Save from 'virtual:icons/mdi/floppy';
	// @ts-ignore
	import ThumbsUp from 'virtual:icons/mdi/thumbs-up';
	// @ts-ignore
	import ThumbsDn from 'virtual:icons/mdi/thumbs-down';
	// @ts-ignore
	import Info from 'virtual:icons/mdi/information-slab-circle-outline';
	let {
		loading,
		addPoints = $bindable(),
		addConquista = $bindable(),
		clearConquistas = $bindable(),
		erroModal = $bindable(),
		clearLog,
		user
	} = $props();

	let cost: number = $state(0);
	let horas = $state(0);
	let dangerZoneAll = $state(false);
	let estudoModal = $state(false);
</script>

<h2 class="w-full text-center">Gerenciar:</h2>
<h3 class="w-full text-center">Contábil</h3>
<div class="flex w-full flex-col gap-5 px-2 lg:flex-row lg:px-0">
	<div class="w-full lg:w-1/2">
		<h3 class="w-full text-center">Pontuações</h3>
		<div
			class="*:bg-primary/30 *:backdrop-blur-xs {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button onclick={() => addPoints(100, user.id, 'tarefas100', 'point')}>
				100% das tarefas concluídas <span class="text-green-600">+100</span></button
			>
			<button onclick={() => addPoints(80, user.id, 'tarefas90', 'point')}>
				90% das tarefas concluídas <span class="text-green-600">+70</span></button
			>
			<button onclick={() => addPoints(60, user.id, 'tarefas80', 'point')}>
				80% das tarefas concluídas <span class="text-green-600">+50</span></button
			>
			<button onclick={() => addPoints(30, user.id, 'tarefas70', 'point')}>
				70% das tarefas concluídas <span class="text-green-600">+30</span></button
			>
			<button onclick={() => addPoints(30, user.id, 'controleAtv', 'point')}>
				Controle de Atividades atualizado <span class="text-green-600">+30</span></button
			>
			<button onclick={() => addPoints(10, user.id, 'elogio', 'point')}>
				Elogio do cliente <span class="text-green-600">+10</span></button
			>
			<button onclick={() => addPoints(5, user.id, 'ideia', 'point')}>
				Ideia de melhoria <span class="text-green-600">+10</span>
			</button>
			<button onclick={() => addPoints(10, user.id, 'maiorideia', 'point')}>
				Maior número de ideias no mês <span class="text-green-600">+15</span>
			</button>
			<button onclick={() => addPoints(15, user.id, 'melhorideia', 'point')}>
				Melhor ideia do mês <span class="text-green-600">+20</span>
			</button>
			<button onclick={() => addPoints(15, user.id, 'indicacao', 'point')}>
				Indicação de cliente <span class="text-green-600">+100</span>
			</button>
			<button onclick={() => (estudoModal = true)}> Atualização profissional </button>
			<button onclick={() => addPoints(-10, user.id, 'reclamacao', 'point')}>
				Reclamação de cliente <span class="text-red-500">-10</span>
			</button>
			<button onclick={() => addPoints(-10, user.id, 'erro', 'point')}>
				Erro cometido <span class="text-red-500">-10</span>
			</button>
			<button onclick={() => (erroModal = true)}> Prejuízo financeiro por erro</button>
		</div>
	</div>

	<div class="w-full lg:w-1/2">
		<h3 class="w-full text-center">Conquistas</h3>
		<div
			class="*:bg-primary/30 *:backdrop-blur-xs {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button onclick={() => addConquista('conqmestarefa', user.id)}
				>Mês com 100% das tarefas no prazo</button
			>
			<button onclick={() => addConquista('conqmesplanilha', user.id)}
				>Mês com planilha de atividades preenchidas</button
			>
			<button onclick={() => addConquista('conqelogio', user.id)}>Elogio de cliente recebido</button
			>
			<button onclick={() => addConquista('conqmaiordomes', user.id)}>Maior pontuação do Mês</button
			>
			<button onclick={() => addConquista('conqmaiordoano', user.id)}>Maior pontuação do Ano</button
			>
			<button onclick={() => addConquista('conqformacao', user.id)}
				>Formação Superior concluída</button
			>
			<button onclick={() => addConquista('conqmesideia', user.id)}>Mês com melhor ideia</button>
			<button onclick={() => addConquista('conqsports', user.id)}>Move Sports completo</button>
		</div>
		<h3 class="mt-4 w-full text-center text-red-500">Danger Zone</h3>
		<p class="mb-2 w-full text-center text-sm opacity-50">Esta ação exige confirmação:</p>
		<div
			class="*:bg-primary/30 *:backdrop-blur-xs {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button
				onclick={() => (dangerZoneAll = true)}
				class="w-full cursor-pointer rounded-lg !bg-red-500/70 p-2 hover:opacity-50"
			>
				Zerar Tudo!
			</button>
		</div>
	</div>
</div>

<div class="flex w-full flex-col items-center gap-5 px-2">
	<h3>BPO</h3>
	<p class="flex items-center gap-2">
		<span>Gerenciamento de Tempo</span>
	</p>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full items-center gap-2">
			<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
				<input
					type="number"
					class=" w-full appearance-none rounded-lg border-0 bg-transparent"
					placeholder="Dia do Fechamento"
				/>
				<button
					class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
					><Info /></button
				>
				<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
					><Save /><span>Salvar</span></button
				>
			</div>
		</div>
	</div>
	<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
		<input
			type="number"
			class=" w-full appearance-none rounded-lg border-0 bg-transparent"
			placeholder="Tempo Gasto"
		/>
		<button
			class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
			><Info /></button
		>
		<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
			><Save /><span>Salvar</span></button
		>
	</div>
	<div class="flex w-full gap-2">
		<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
			<input
				type="number"
				class=" w-full appearance-none rounded-lg border-0 bg-transparent"
				placeholder="Redução de Tempo (%)"
			/>
			<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
				><ThumbsUp class="text-green-600 md:text-white" /><span class="hidden md:block">Salvar</span
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
			/>
			<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
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
			class=" w-full appearance-none rounded-lg border-0 bg-transparent"
			placeholder="Pontos por Honorário"
		/>
		<button
			class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
			><Info /></button
		>
		<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
			><Save /><span>Salvar</span></button
		>
	</div>
	<button class="bg-primary/30 w-full cursor-pointer rounded-xl py-3"
		>Emissão de boleto CA (indicação) <span class="text-green-600">+20</span></button
	>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full gap-2 *:cursor-pointer">
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>PlayBPO incorreto <span class="text-red-500">-30</span></button
			>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>PlayBPO em dia <span class="text-green-600">+30</span></button
			>
		</div>
	</div>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full gap-2 *:cursor-pointer">
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>Reclamação de Cliente <span class="text-red-500">-10</span></button
			>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>Elogio de Cliente <span class="text-green-600">+10</span></button
			>
		</div>
	</div>
	<p class="flex items-center gap-2">
		<span>Dinâmicas Internas</span>
	</p>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full gap-2 *:cursor-pointer">
			<button class="bg-primary/30 w-full rounded-xl py-3"
				>Primeiro Lugar <span class="text-green-600">+30</span></button
			>
			<button
				class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
				><Info /></button
			>
			<button class="bg-primary/30 w-full rounded-xl py-3"
				>Segundo Lugar <span class="text-green-600">+15</span></button
			>
		</div>
	</div>
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex w-full gap-2 *:cursor-pointer">
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>Idéia aplicada <span class="text-green-600">+5</span></button
			>
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>Maior número de idéias <span class="text-green-600">+50</span></button
			>
			<button class="bg-primary/30 w-full rounded-xl p-3"
				>Melhor idéia <span class="text-green-600">+50</span></button
			>
		</div>
	</div>
	<p class="flex items-center gap-2">
		<span>Falhas</span>
	</p>
	<button class="bg-primary/30 w-full cursor-pointer rounded-xl p-3"
		>Não envio de vencimentos ou pagamentos <span class="text-red-500">-5</span></button
	>
	<div class="bg-primary/20 flex w-full gap-2 rounded-xl border border-white/20">
		<input
			type="number"
			class=" w-full appearance-none rounded-lg border-0 bg-transparent"
			placeholder="Prejuízo (em R$)"
		/>
		<button
			class="cursor-pointer justify-center text-xl opacity-50 transition-opacity hover:opacity-100"
			><Info /></button
		>
		<button class="bg-primary/30 m-1 flex items-center justify-center gap-1 rounded-lg p-2"
			><Save /><span>Salvar</span></button
		>
	</div>
</div>

{#if erroModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">Prejuízo financeiro por erro</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex w-full items-center gap-1">
						<span>R$</span>
						<input
							class="bg-primary/30 w-full rounded-lg placeholder:text-white/40"
							type="number"
							name="cost"
							id="cost"
							bind:value={cost}
							placeholder="Custo"
						/>
					</div>
					<p class="opacity-50">R$10,00 = 1 ponto</p>
				</div>
				<button
					disabled={cost <= 0 || typeof cost !== 'number'}
					onclick={() => {
						addPoints(Math.ceil(-cost * 0.1), user.id, 'errovalor', 'point'), (erroModal = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
				>
					Prejuízo financeiro por erro <span class="text-red-500">{Math.ceil(-cost * 0.1)}</span>
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (erroModal = false)}>Fechar</button
				>
			</div>
		</div>
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

{#if estudoModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">Horas de estudo</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex w-full items-center gap-1">
						<input
							class="bg-primary/30 w-full rounded-lg placeholder:text-white/40"
							type="number"
							name="horas"
							id="horas"
							bind:value={horas}
							placeholder="Horas de curso"
						/>
					</div>
					<p class="opacity-50">1 hora = 1 ponto</p>
				</div>
				<button
					disabled={horas <= 0 || typeof horas !== 'number'}
					onclick={() => {
						addPoints(horas, user.id, 'horacurso', 'point'), (estudoModal = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
				>
					Horas de curso: <span class="text-green-600">{horas}</span>
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (estudoModal = false)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}
