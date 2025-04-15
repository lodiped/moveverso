import type { Log, Conquista } from '$lib/types.svelte';

export let user = $state({
	name: 'Fulano Silva',
	email: 'fulano@email.com',
	ingress: '05/05/23',
	nivel: 0,
	fase: 0,
	total: 0,
	current: 0,
	log: [] as Log[],
	conquistas: [] as Conquista[]
});

export let users = $state([
	{
		name: 'Andreus Siegrist',
		ingress: '04/04/22',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Larissa Martins',
		ingress: '11/09/23',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Franciely Oliveira',
		ingress: '18/11/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},

	{
		name: 'Cristina Meyer',
		ingress: '02/12/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Phelipe Mendes',
		ingress: '22/04/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Rafael Wolski',
		ingress: '16/01/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Roberson Correa',
		ingress: '24/08/23',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Tamiris Rosa ',
		ingress: '01/02/21',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Lucas Eyng',
		ingress: '17/03/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Fernanda Frandoloso',
		ingress: '12/02/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Arthur Rezner',
		ingress: '14/04/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	},
	{
		name: 'Luiz Faquim',
		ingress: '14/04/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: [] as Conquista[]
	}
]);

export let conquistas = $state([
	{ title: 'Escudo', desc: '3 Meses com 100% das tarefas no prazo', img: '🛡️' },
	{ title: 'Relógio', desc: '3 Meses com planilhas de atividades preenchidas', img: '⏱️' },
	{ title: 'Algum Nome', desc: '1 ano de Move Negócios', img: '💎' },
	{ title: 'Selo Especial', desc: '10 elogios recebidos', img: '✨' },
	{ title: 'Decolagem', desc: 'Maior pontuação do Mês', img: '🚀' },
	{ title: 'Em Órbita', desc: 'Maior pontuação do Ano', img: '🌟' }
]);

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
	user.conquistas = [];
}

export function calc() {
	user.current = Math.abs(1500 * (faseCalc() + 1) - user.total - 1500);
	nivelCalc();
	faseCalc();
}

export function nivelCalc() {
	user.nivel = Math.floor(user.current / 150);
	if (user.nivel > 9) {
		user.nivel = 9;
	}
	return user.nivel;
}
export function faseCalc() {
	user.fase = Math.floor(user.total / 1500);
	if (user.fase > 4) {
		user.fase = 4;
	}
	return user.fase;
}
export function add(n: number, log: Log) {
	if (n <= 0 && user.total <= 0) {
		n = 0;
		log.points = 0;
	}
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

export function addConquista(n: number, log: Log) {
	user.conquistas.push(conquistas[n]);
	user.log.unshift(log);
}

export function remove(n: number) {
	user.total -= n;
	if (user.total < 0) {
		user.total = 0;
	}
	calc();
}

export function date() {
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
