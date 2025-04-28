import { get, ref, getDatabase, child } from '$lib/firebase';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Checa se o usuário está logado persistentemente
if (typeof window !== 'undefined') {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isAdmin.value = true;
		} else {
			isAdmin.value = false;
		}
	});
}

export const isAdmin = $state({ value: false });

const dbRef = ref(getDatabase());
export const loading = $state({ value: false });
let data: any = $state();
export const userArray = $state({ value: [] as any[] });

//Front-end stuff
export const totalConquistas = $state({ value: 0 });

export function sumConquistasCalc(i: number) {
	totalConquistas.value = 0;
	for (let y = 0; y < userArray.value?.[i].conquistas.length; y++) {
		if (userArray.value?.[i].conquistas[y].number > 0) {
			totalConquistas.value += userArray.value?.[i].conquistas[y].number;
		}
	}
}

export async function check() {
	try {
		loading.value = true;
		const snapshot = await get(child(dbRef, '/users'));
		data = snapshot.exists() ? snapshot.val() : null;
		userArray.value = Object.entries(data).map(([uid, userData]: any) => {
			const total = userData.total;
			const fase = faseCalc(total);
			const current = currentCalc(total, fase);
			const nivel = nivelCalc(current);
			const xp = currentXP(current, nivel);
			const conquistas = userData.conquistas
				? Object.entries(userData.conquistas).map(([conqId, conqData]: any) => ({
						id: conqId,
						number: conqData.number,
						title: baseConquistas[conqId]?.title ?? '--',
						desc: baseConquistas[conqId]?.desc ?? '--',
						img: baseConquistas[conqId]?.img ?? '--'
					}))
				: [];

			return {
				id: uid,
				...userData,
				current,
				fase,
				nivel,
				xp,
				conquistas
			};
		});

		userArray.value = userArray.value.map((user, idx) => ({
			...user,
			arrayId: idx
		}));

		loading.value = false;
	} catch (error) {
		console.error(error);
	}
}

const baseConquistas: any = {
	formacao: {
		title: 'Formação Superior',
		desc: 'Concluiu uma formação superior',
		img: '💎'
	},
	elogio: {
		title: 'Selo Especial',
		desc: 'Elogio de cliente recebido',
		img: '✨'
	},
	mesideia: {
		title: 'Selo Especial',
		desc: 'Melhor ideia do mês',
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
	mesplanilha: {
		title: 'Relógio',
		desc: 'Mês com planilha de atividades preenchidas',
		img: '⏱️'
	},
	mestarefa: {
		title: 'Escudo',
		desc: 'Mês com 100% das tarefas no prazo',
		img: '🛡️'
	}
};

export let logText = $state({
	ano: { text: 'Conquista: 1 Ano de Move Negócios' },
	elogio: { text: '10 elogios recebidos' },
	elogiopoints: { text: 'Elogio recebido', points: 10 }
});

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
	}
]);*/

export let titlesfem: any = $state({
	fase: [
		{
			title: 'Origem dos Poderes',
			nivel: [
				'Recruta',
				'Estudante',
				'Visionária Iniciante',
				'Treinando as Habilidades',
				'Exploradora de Dados',
				'Cidadã Vigilante',
				'Portadora de Propósito',
				'Aprendiz de Herói',
				'Heroína em Formação',
				'Estagiária de Superpoderes'
			]
		},
		{
			title: 'Superação',
			nivel: [
				'Defensora de Prazos',
				'Veloz das Tarefas',
				'Comunicadora Ágil',
				'Sentinela de Rotina',
				'Domadora de Demandas',
				'Guardiã do Cliente',
				'Organizadora Notável',
				'Corajosa das Planilhas',
				'Escudo contra Erros',
				'Protetora da Ordem'
			]
		},
		{
			title: 'Ascensão',
			nivel: [
				'Heroína Operacional',
				'Executora Incansável',
				'Controladora do Caos',
				'Mestre de Sistemas',
				'Construtora de Processos',
				'Inspiradora da Equipe',
				'Protetora da Qualidade',
				'Rastreadora de Soluções',
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
				'Caçadora de Melhorias',
				'Guardiã Supremo da Rotina',
				'Capitã da Eficiência',
				'Arquiteta da Cultura',
				'Comandante de Processos',
				'Embaixadora da Excelência',
				'Guerreira da Alta Perfomance'
			]
		},
		{
			title: 'Lendas Imortais',
			nivel: [
				'Mestre Supremo',
				'Mentora de Novas Gerações',
				'Campeã de Valores',
				'Guardiã Universal',
				'Mito da Rotina',
				'Heroína dos Heróis',
				'Consciência Operacional',
				'Ícone do Time',
				'Espirito da Excelência',
				'Lenda Imortal'
			]
		}
	]
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

export function faseCalc(total: number) {
	const f = Math.floor(total / 1500);
	return f > 4 ? 5 : f + 1;
}
export function currentCalc(total: number, fase: number): number {
	return Math.abs(1500 * fase - total - 1500);
}
export function currentXP(current: number, nivel: number): number {
	return Math.abs(150 * nivel - current - 150);
}
export function nivelCalc(current: number): number {
	const lvl = Math.floor(current / 150);
	return lvl > 9 ? 10 : lvl + 1;
}

/*export function resetAll() {
	user.total = 0;
	calc();
	user.log = [];
	user.conquistas = [];
}*/

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
*/
