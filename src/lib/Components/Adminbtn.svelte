<script>
	let { add, resetAll } = $props();

	function date() {
		let date = new Date();
		let diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
		return (
			date.toLocaleDateString('pt-BR') +
			' • ' +
			diaSemana[date.getDay()] +
			' • ' +
			date.toLocaleTimeString('pt-BR')
		);
	}
</script>

<div class="*:bg-primary/30 flex flex-col items-center gap-2 *:w-[50%] *:rounded-md *:p-1 *:px-4">
	<button
		onclick={() => add(100, { date: date(), text: '100% das tarefas concluídas', points: 100 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>100% das tarefas concluídas <span class="text-green-600">+100</span></button
	>
	<button
		onclick={() => add(70, { date: date(), text: '90% das tarefas concluídas', points: 70 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>90% das tarefas concluídas <span class="text-green-600">+70</span></button
	>
	<button
		onclick={() => add(50, { date: date(), text: '80% das tarefas concluídas', points: 50 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>80% das tarefas concluídas <span class="text-green-600">+50</span></button
	>
	<button
		onclick={() => add(30, { date: date(), text: '70% das tarefas concluídas', points: 30 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>70% das tarefas concluídas <span class="text-green-600">+30</span></button
	>
	<button
		onclick={() => add(30, { date: date(), text: 'Controle de Atividades Atualizado', points: 30 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Controle de Atividades Atualizado <span class="text-green-600">+30</span></button
	>
	<button
		onclick={() => add(10, { date: date(), text: 'Elogio do Cliente', points: 10 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Elogio do Cliente <span class="text-green-600">+10</span></button
	>
	<button
		onclick={() => add(10, { date: date(), text: 'Ideia de Melhoria Aplicada', points: 10 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Ideia de Melhoria Aplicada <span class="text-green-600">+10</span></button
	>
	<button
		onclick={() => add(15, { date: date(), text: 'Maior número de Ideias no mês', points: 15 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Maior número de Ideias no mês <span class="text-green-600">+15</span></button
	>
	<button
		onclick={() => add(20, { date: date(), text: 'Melhor ideia do Mês', points: 20 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Melhor ideia do Mês <span class="text-green-600">+20</span></button
	>
	<button
		onclick={() =>
			add(100, { date: date(), text: 'Indicação de cliente que fecha contrato', points: 100 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Indicação de cliente que fecha contrato <span class="text-green-600">+100</span></button
	>
	<button
		onclick={() => add(20, { date: date(), text: 'Atualização profissional', points: 20 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Atualização profissional <span class="text-green-600">+20</span></button
	>
	<button
		onclick={() => add(-10, { date: date(), text: 'Reclamação de cliente', points: -10 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Reclamação de cliente <span class="text-red-600">-10</span></button
	>
	<button
		onclick={() => add(-10, { date: date(), text: 'Erro cometido', points: -10 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Erro cometido <span class="text-red-600">-10</span></button
	>
	<button
		onclick={() => add(-1, { date: date(), text: 'Prejuízo financeiro por erro', points: -1 })}
		class="cursor-pointer hover:font-bold hover:opacity-50"
		>Prejuízo financeiro por erro <span class="text-red-600">-1</span></button
	>
	<button onclick={() => resetAll()} class="cursor-pointer hover:font-bold hover:opacity-50"
		>RESET</button
	>
</div>
