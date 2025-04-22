import type { Log, UserConquista, BaseConquista } from '$lib/types.svelte';
import { db, get, ref, onValue, getDatabase, child } from '$lib/firebase';
import { set } from 'firebase/database';

export let isAdmin = $state({ value: false });

const dbRef = ref(getDatabase());
export let loading = $state({ value: false });
let data: any = $state();
export let userArray = $state({ value: [] as any[] });

export function addPoints(n: number, uid: string) {
	if (!data?.[uid]) {
		console.error('User not found');
		return;
	}
	console.log(JSON.stringify(data, null, 4));

	const newTotal = data?.[uid].total + n;
	loading.value = true;
	set(ref(db, `users/${uid}/total`), newTotal)
		.then(() => {
			check(), (loading.value = false);
		})
		.catch(() => {
			console.error, (loading.value = false);
		});
}

export async function check() {
	try {
		loading.value = true;
		const snapshot = await get(child(dbRef, '/users'));
		data = snapshot.exists() ? snapshot.val() : null;
		console.log('before ', data);
		userArray.value = Object.entries(data).map(([uid, userData]: any) => {
			const total = userData.total;
			const fase = faseCalc(total);
			const current = currentCalc(total, fase);
			const nivel = nivelCalc(current);
			const conquistasArray = userData.conquistas
				? Object.entries(userData.conquistas).map(([conqId, conqData]: any) => ({
						id: conqId,
						number: conqData.number,
						title: baseConquistas[conqId]?.title ?? '--',
						desc: baseConquistas[conqId]?.desc ?? '--',
						img: baseConquistas[conqId]?.img ?? '--'
					}))
				: [];
			// TODO iterate through conquistas.number to sum the total amount of conquistas the user has for the front-end

			return {
				id: uid,
				...userData,
				current,
				fase,
				nivel,
				conquistas: conquistasArray
			};
		});

		console.log('after ', JSON.stringify(userArray, null, 4));

		userArray.value.forEach((banana) => {
			console.log(banana.id, banana.total, banana.name);
		});
		loading.value = false;
	} catch (error) {
		console.error(error);
	}
}

/*export let user = $state({
	name: 'Fulano Silva',
	email: 'fulano@email.com',
	ingress: '05/05/23',
	nivel: 0,
	fase: 0,
	total: 0,
	current: 0,
	log: [] as Log[],
	conquistas: createUserConquistas()
});
*/
const baseConquistas: any = {
	ano: {
		title: 'Um Ano',
		desc: '1 ano de Move Negócios',
		img: '💎'
	},
	dezelogios: {
		title: 'Selo Especial',
		desc: '10 elogios recebidos',
		img: '✨'
	},
	maiordoano: {
		title: 'Em Órbita',
		desc: 'Maior pontuação do Ano',
		img: '🌟'
	},
	maiordomes: {
		title: 'Decolagem',
		desc: 'Maior pontuação do Mês',
		img: '🚀'
	},
	tresmesesplanilha: {
		title: 'Relógio',
		desc: '3 Meses com planilhas de atividades preenchidas',
		img: '⏱️'
	},
	tresmesestarefa: {
		title: 'Escudo',
		desc: '3 Meses com 100% das tarefas no prazo',
		img: '🛡️'
	}
};

/*
export let users = $state([
	{
		id: 'andreussiegrist',
		name: 'Andreus Siegrist',
		ingress: '04/04/22',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'larissamartins',
		name: 'Larissa Martins',
		ingress: '11/09/23',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'francielyoliveira',
		name: 'Franciely Oliveira',
		ingress: '18/11/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'cristinameyer',
		name: 'Cristina Meyer',
		ingress: '02/12/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'phelipemendes',
		name: 'Phelipe Mendes',
		ingress: '22/04/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'rafaelwolski',
		name: 'Rafael Wolski',
		ingress: '16/01/24',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'robersoncorrea',
		name: 'Roberson Correa',
		ingress: '24/08/23',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'tamirisrosa',
		name: 'Tamiris Rosa ',
		ingress: '01/02/21',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'lucaseyng',
		name: 'Lucas Eyng',
		ingress: '17/03/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'fernandafrandoloso',
		name: 'Fernanda Frandoloso',
		ingress: '12/02/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'arthurrezner',
		name: 'Arthur Rezner',
		ingress: '14/04/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	},
	{
		id: 'luizfaquim',
		name: 'Luiz Faquim',
		ingress: '14/04/25',
		nivel: 0,
		fase: 0,
		total: 0,
		current: 0,
		log: [] as Log[],
		conquistas: createUserConquistas()
	}
]);*/

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

/*export function resetAll() {
	user.total = 0;
	calc();
	user.log = [];
	user.conquistas = [];
}*/

let user = $state({
	current: 0,
	nivel: 0,
	fase: 0
});
// export function calc(uid: string) {
// 	user.current = Math.abs(1500 * (faseCalc(uid) + 1) - data?.[uid].total - 1500);
// 	nivelCalc();
// 	faseCalc(uid);
// }

// export function nivelCalc() {
// 	user.nivel = Math.floor(user.current / 150);
// 	if (user.nivel > 9) {
// 		user.nivel = 9;
// 	}
// 	return user.nivel;
// }
export function faseCalc(total: number) {
	const f = Math.floor(total / 1500);
	return f > 4 ? 5 : f + 1;
}
export function currentCalc(total: number, fase: number): number {
	return Math.abs(1500 * fase - total - 1500);
}
export function nivelCalc(current: number): number {
	const lvl = Math.floor(current / 150);
	return lvl > 9 ? 10 : lvl + 1;
}
/*
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

/*export function addConquista(n: number, log: Log) {
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
}*/
