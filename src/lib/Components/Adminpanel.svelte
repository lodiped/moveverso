<script lang="ts">
	let {
		loading,
		addSomething = $bindable(),
		addConquista = $bindable(),
		clearConquistas = $bindable(),
		erroModal = $bindable(),
		testLog,
		user,
		cost = $bindable()
	} = $props();

	let dangerZonePoints = $state(false);
	let dangerZoneConquistas = $state(false);
</script>

<h2 class="w-full text-center">Administração</h2>
<div class="flex w-full flex-col gap-5 px-2 lg:flex-row lg:px-0">
	<div class="w-full lg:w-1/2">
		<h3 class="w-full text-center">Pontuações</h3>
		<div
			class="*:bg-primary/30 {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button onclick={() => addSomething(100, user.id)}>
				100% das tarefas concluídas <span class="text-green-600">+100</span></button
			>
			<button onclick={() => addSomething(70, user.id)}>
				90% das tarefas concluídas <span class="text-green-600">+70</span></button
			>
			<button onclick={() => addSomething(50, user.id)}>
				80% das tarefas concluídas <span class="text-green-600">+50</span></button
			>
			<button onclick={() => addSomething(30, user.id)}>
				70% das tarefas concluídas <span class="text-green-600">+30</span></button
			>
			<button onclick={() => addSomething(30, user.id)}>
				Controle de Atividades atualizado <span class="text-green-600">+30</span></button
			>
			<button onclick={() => addSomething(10, user.id)}>
				Elogio do cliente <span class="text-green-600">+10</span></button
			>
			<button onclick={() => addSomething(10, user.id)}>
				Ideia de melhoria aplicada <span class="text-green-600">+10</span>
			</button>
			<button onclick={() => addSomething(15, user.id)}>
				Maior número de ideias no mês <span class="text-green-600">+15</span>
			</button>
			<button onclick={() => addSomething(20, user.id)}>
				Melhor ideia do mês <span class="text-green-600">+20</span>
			</button>
			<button onclick={() => addSomething(100, user.id)}>
				Indicação de cliente que fecha contrato <span class="text-green-600">+100</span>
			</button>
			<button onclick={() => addSomething(20, user.id)}>
				Atualização profissional <span class="text-green-600">+20</span>
			</button>
			<button onclick={() => addSomething(-10, user.id)}>
				Reclamação de cliente <span class="text-red-600">-10</span>
			</button>
			<button onclick={() => addSomething(-10, user.id)}>
				Erro cometido <span class="text-red-600">-10</span>
			</button>
			<button onclick={() => (erroModal = true)}> Prejuízo financeiro por erro</button>
		</div>
	</div>

	<div class="w-full lg:w-1/2">
		<h3 class="w-full text-center">Conquistas</h3>
		<div
			class="*:bg-primary/30 {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button onclick={() => addConquista('ano', user.id)}>1 Ano de Move Negócios</button>
			<button onclick={() => addConquista('tresmesestarefa', user.id)}
				>3 Meses com 100% das tarefas no prazo</button
			>
			<button onclick={() => addConquista('tresmesesplanilha', user.id)}
				>3 Meses com planilhas de atividades preenchidas</button
			>
			<button onclick={() => addConquista('dezelogios', user.id)}>10 elogios recebidos</button>
			<button onclick={() => addConquista('maiordomes', user.id)}>Maior pontuação do Mês</button>
			<button onclick={() => addConquista('maiordoano', user.id)}>Maior pontuação do Ano</button>
		</div>
		<h3 class="mt-4 w-full text-center text-red-500">Danger Zone</h3>
		<p class="mb-2 w-full text-center text-sm opacity-50">Estas ações exigem confirmação:</p>
		<div
			class="*:bg-primary/30 {loading
				? 'pointer-events-none cursor-default opacity-50'
				: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
		>
			<button
				onclick={() => (dangerZonePoints = true)}
				class="w-full cursor-pointer rounded-lg !bg-red-500/70 p-2 hover:opacity-50"
			>
				Zerar todos os pontos
			</button>
			<button
				onclick={() => (dangerZoneConquistas = true)}
				class="w-full cursor-pointer rounded-lg !bg-red-500/70 p-2 hover:opacity-50"
			>
				Apagar todas as conquistas
			</button>
			<button class="w-full cursor-pointer rounded-lg !bg-red-500/70 p-2 hover:opacity-50">
				Apagar o Log
			</button>
			<button
				onclick={() => testLog()}
				class="w-full cursor-pointer rounded-lg !bg-red-500/70 p-2 hover:opacity-50"
			>
				Test Log
			</button>
		</div>
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
						addSomething(Math.ceil(-cost * 0.1), user.id), (erroModal = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
				>
					Prejuízo financeiro por erro <span class="text-red-600">{Math.ceil(-cost * 0.1)}</span>
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (erroModal = false)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}

{#if dangerZonePoints}
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
						addSomething(-1000000, user.id), (dangerZonePoints = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50"
				>
					Apagar pontos
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (dangerZonePoints = false)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}

{#if dangerZoneConquistas}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
		<div class="bg-secondary/30 flex flex-col gap-10 rounded-xl p-10 backdrop-blur">
			<h2 class="text-center">Tem certeza?</h2>
			<div class="flex flex-col items-center gap-5">
				<div class="flex flex-col items-center gap-1">
					<div class="flex flex-col items-center gap-2">
						<p>Esta ação irá apagar todas as conquistas desta pessoa</p>
					</div>
				</div>
				<button
					onclick={() => {
						clearConquistas(user.id), (dangerZoneConquistas = false);
					}}
					class="bg-primary w-fit cursor-pointer rounded-lg p-2 text-black hover:font-bold hover:opacity-50"
				>
					Apagar conquistas
				</button>
				<button
					class="bg-primary/30 border-primary w-fit cursor-pointer rounded-lg border p-2 hover:font-bold hover:opacity-50"
					onclick={() => (dangerZoneConquistas = false)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}
