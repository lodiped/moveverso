<script>
	import { user, conquistas, date, addConquista } from '$lib/state.svelte';

	let { add, resetAll } = $props();

	let prejuizo = $state(false);
</script>

<div class="flex w-full gap-2">
	<div class="w-full">
		<div
			class="*:bg-primary/30 flex flex-col items-center gap-2 *:w-full *:rounded-md *:p-1 *:px-4"
		>
			<button onclick={() => resetAll()} class="cursor-pointer hover:font-bold hover:opacity-50"
				>RESET</button
			>
			<button
				onclick={() =>
					add(100, {
						date: date(),
						text: '100% das tarefas concluídas',
						points: 100,
						type: 'pontos'
					})}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>100% das tarefas concluídas <span class="text-green-600">+100</span></button
			>
			<button
				onclick={() =>
					add(70, { date: date(), text: '90% das tarefas concluídas', points: 70, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>90% das tarefas concluídas <span class="text-green-600">+70</span></button
			>
			<button
				onclick={() =>
					add(50, { date: date(), text: '80% das tarefas concluídas', points: 50, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>80% das tarefas concluídas <span class="text-green-600">+50</span></button
			>
			<button
				onclick={() =>
					add(30, { date: date(), text: '70% das tarefas concluídas', points: 30, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>70% das tarefas concluídas <span class="text-green-600">+30</span></button
			>
			<button
				onclick={() =>
					add(30, {
						date: date(),
						text: 'Controle de Atividades Atualizado',
						points: 30,
						type: 'pontos'
					})}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Controle de Atividades Atualizado <span class="text-green-600">+30</span></button
			>
			<button
				onclick={() =>
					add(10, { date: date(), text: 'Elogio do Cliente', points: 10, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Elogio do Cliente <span class="text-green-600">+10</span></button
			>
			<button
				onclick={() =>
					add(10, { date: date(), text: 'Ideia de Melhoria Aplicada', points: 10, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Ideia de Melhoria Aplicada <span class="text-green-600">+10</span></button
			>
			<button
				onclick={() =>
					add(15, {
						date: date(),
						text: 'Maior número de Ideias no mês',
						points: 15,
						type: 'pontos'
					})}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Maior número de Ideias no mês <span class="text-green-600">+15</span></button
			>
			<button
				onclick={() =>
					add(20, { date: date(), text: 'Melhor ideia do Mês', points: 20, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Melhor ideia do Mês <span class="text-green-600">+20</span></button
			>
			<button
				onclick={() =>
					add(100, {
						date: date(),
						text: 'Indicação de cliente que fecha contrato',
						points: 100,
						type: 'pontos'
					})}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Indicação de cliente que fecha contrato <span class="text-green-600">+100</span></button
			>
			<button
				onclick={() =>
					add(20, { date: date(), text: 'Atualização profissional', points: 20, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Atualização profissional <span class="text-green-600">+20</span></button
			>
			<button
				onclick={() =>
					add(-10, { date: date(), text: 'Reclamação de cliente', points: -10, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Reclamação de cliente <span class="text-red-600">-10</span></button
			>
			<button
				onclick={() =>
					add(-10, { date: date(), text: 'Erro cometido', points: -10, type: 'pontos' })}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Erro cometido <span class="text-red-600">-10</span></button
			>
			<button
				onclick={() => (prejuizo = !prejuizo)}
				class="cursor-pointer hover:font-bold hover:opacity-50"
				>Prejuízo financeiro por erro <span class="text-red-600">-1/R$10,00</span></button
			>
		</div>
	</div>
	<div class="flex w-full flex-col">
		<div
			class="*:bg-primary/30 flex flex-col items-center gap-2 *:w-full *:rounded-md *:p-1 *:px-4"
		>
			<button
				onclick={() =>
					addConquista(0, {
						date: date(),
						text: 'Conquista: ' + conquistas[0].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[0].title}</button
			>
			<button
				onclick={() =>
					addConquista(1, {
						date: date(),
						text: 'Conquista: ' + conquistas[1].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[1].title}</button
			>
			<button
				onclick={() =>
					addConquista(2, {
						date: date(),
						text: 'Conquista: ' + conquistas[2].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[2].title}</button
			>
			<button
				onclick={() =>
					addConquista(3, {
						date: date(),
						text: 'Conquista: ' + conquistas[3].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[3].title}</button
			>
			<button
				onclick={() =>
					addConquista(4, {
						date: date(),
						text: 'Conquista: ' + conquistas[4].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[4].title}</button
			>
			<button
				onclick={() =>
					addConquista(5, {
						date: date(),
						text: 'Conquista: ' + conquistas[5].title,
						points: 0,
						type: 'conquista'
					})}>{conquistas[5].title}</button
			>
		</div>
	</div>
</div>

{#if prejuizo}
	<div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black/30">
		<button
			class="absolute top-0 right-0 m-5 flex items-center justify-center rounded-full bg-gray-200 px-6 py-4 text-black"
			onclick={() => (prejuizo = !prejuizo)}>X</button
		>
		<button
			onclick={() =>
				add(-1, {
					date: date(),
					text: 'Prejuízo financeiro por erro',
					points: -1,
					type: 'pontos'
				})}
			class="cursor-pointer hover:font-bold hover:opacity-50"
			>Prejuízo financeiro por erro <span class="text-red-600">-1</span></button
		>
	</div>
{/if}
