import type { Log } from '$lib/types.svelte';

export let user = $state({
	name: 'Fulano Silva',
	nivel: 0,
	fase: 0,
	total: 0,
	current: 0,
	log: [] as Log[]
});

export let titles: any = $state({
	fase: [
		{
			title: 'Origem dos Poderes',
			nivel: [
				'Recruta',
				'Estudante',
				'Visionário Iniciante',
				'Treinando as Habilidades',
				'Explorador de Dados',
				'Cidadão Vigilante',
				'Portador de Propósito',
				'Aprendiz de Herói',
				'Herói em Formação',
				'Estagiário de Superpoderes'
			]
		},
		{
			title: 'Superação',
			nivel: [
				'Defensor de Prazos',
				'Veloz das Tarefas',
				'Comunicador Ágil',
				'Sentinela de Rotina',
				'Domador de Demandas',
				'Guardião do Cliente',
				'Organizador Notável',
				'Corajoso das Planilhas',
				'Escudo contra Erros',
				'Protetor da Ordem'
			]
		},
		{
			title: 'Ascensão',
			nivel: [
				'Herói Operacional',
				'Executor Incansável',
				'Controlador do Caos',
				'Mestre de Sistemas',
				'Construtor de Processos',
				'Inspirador da Equipe',
				'Protetor da Qualidade',
				'Rastreador de Soluções',
				'Inteligente Tático',
				'Comandante de Resultados'
			]
		},
		{
			title: 'Elite Heroica',
			nivel: [
				'General de Perfomance',
				'Mente Estratégica',
				'Líder de Missão',
				'Caçador de Melhorias',
				'Guardião Supremo da Rotina',
				'Capitão da Eficiência',
				'Arquiteto da Cultura',
				'Comandante de Processos',
				'Embaixador da Excelência',
				'Guerreiro da Alta Perfomance'
			]
		},
		{
			title: 'Lendas Imortais',
			nivel: [
				'Mestre Supremo',
				'Mentor de Novas Gerações',
				'Campeão de Valores',
				'Guardião Universal',
				'Mito da Rotina',
				'Herói dos Heróis',
				'Consciência Operacional',
				'Ícone do Time',
				'Espirito da Excelência',
				'Lenda Imortal'
			]
		}
	]
});

export function resetAll() {
	user.total = 0;
	calc();
	user.log = [];
}

export function calc() {
	user.current = Math.abs(1500 * (faseCalc() + 1) - user.total - 1500);
	nivelCalc();
	faseCalc();
}

export function nivelCalc() {
	user.nivel = Math.floor(user.current / 150);
	return user.nivel;
}
export function faseCalc() {
	user.fase = Math.floor(user.total / 1500);
	return user.fase;
}
export function add(n: number, log: Log) {
	user.total += n;
	if (user.total < 0) {
		user.total = 0;
	}
	if (user.total >= 7500) {
		user.total = 7500;
	}
	user.log.unshift(log);
	calc();
}

export function remove(n: number) {
	user.total -= n;
	if (user.total < 0) {
		user.total = 0;
	}
	calc();
}
