import { get, ref, getDatabase, child, auth } from '$lib/firebase';
import {
	query,
	startAfter,
	limitToFirst,
	orderByKey,
	endBefore,
	limitToLast
} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

export const homepage = $state({ value: true });
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
export const userLog = $state({ value: [] as any[] });

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

export const logPage = $state({ value: 1 });
export const firstKey = $state({ value: null });
export const lastKey = $state({ value: null });
export const pageDirection = $state({ value: 'next' });
export const hasMore = $state({ value: false });

export async function checkLog(uid: string) {
	const logsRef = ref(getDatabase(), `/logs/${uid}`);
	console.log('checking log');
	try {
		loading.value = true;
		let q;
		if (logPage.value === 1) {
			q = query(logsRef, orderByKey(), limitToLast(10));
		} else if (pageDirection.value === 'next') {
			if (!firstKey) return;
			q = query(logsRef, orderByKey(), endBefore(firstKey.value), limitToLast(10));
		} else {
			if (!lastKey) return;
			q = query(logsRef, orderByKey(), startAfter(lastKey.value), limitToFirst(10));
		}
		const sortSnap = await get(q);
		const sortData = sortSnap.exists() ? sortSnap.val() : null;
		if (sortData) {
			userLog.value = Object.entries(sortData).map(([id, entry]: any) => {
				return {
					id,
					text: logText[entry.action]?.desc ?? '--',
					type: logText[entry.action]?.type ?? '--',
					points: logText[entry.action]?.points ?? logText[entry.action]?.img,
					...entry
				};
			});
			userLog.value.sort((a, b) => (a.id < b.id ? 1 : -1));
			if (userLog.value.length > 0) {
				lastKey.value = userLog.value[0].id;
				firstKey.value = userLog.value[userLog.value.length - 1].id;
			} else {
				hasMore.value = false;
			}
			hasMore.value = userLog.value.length === 10;
		} else {
			userLog.value = [];
		}
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
}

export async function check() {
	console.log('checking Check');
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
						title: logText[conqId]?.title ?? '--',
						desc: logText[conqId]?.desc ?? '--',
						img: logText[conqId]?.img ?? '--'
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

export let logText: any = $state({
	conqformacao: {
		title: 'Formação Superior',
		desc: 'Concluiu uma formação superior',
		img: '🎓',
		type: 'conq'
	},
	conqelogio: {
		title: 'Selo Especial',
		desc: 'Elogio de cliente recebido',
		img: '💎',
		type: 'conq'
	},
	conqmesideia: {
		title: 'Selo Especial',
		desc: 'Melhor ideia do mês',
		img: '💡',
		type: 'conq'
	},
	conqmaiordoano: {
		title: 'Em Órbita',
		desc: 'Maior pontuação do Ano',
		img: '🏆',
		type: 'conq'
	},
	conqmaiordomes: {
		title: 'Decolagem',
		desc: 'Maior pontuação do Mês',
		img: '🎖️',
		type: 'conq'
	},
	conqmesplanilha: {
		title: 'Relógio',
		desc: 'Mês com planilha de atividades preenchidas',
		img: '📜',
		type: 'conq'
	},
	conqmestarefa: {
		title: 'Escudo',
		desc: 'Mês com 100% das tarefas no prazo',
		img: '🌟',
		type: 'conq'
	},
	elogio: { desc: 'Elogio recebido de cliente', points: 10, type: 'point' },
	tarefas70: { desc: '70% das tarefas concluídas', points: 30, type: 'point' },
	tarefas90: { desc: '90% das tarefas concluídas', points: 70, type: 'point' },
	tarefas80: { desc: '80% das tarefas concluídas', points: 50, type: 'point' },
	tarefas100: { desc: '100% das tarefas concluídas', points: 100, type: 'point' },
	controleAtv: { desc: 'Controle de Atividades atualizado', points: 30, type: 'point' },
	reclamacao: { desc: 'Reclamação de cliente', points: -10, type: 'point' },
	ideia: { desc: 'Ideia de melhoria', points: 10, type: 'point' },
	melhorideia: { desc: 'Melhor ideia do mês', points: 20, type: 'point' },
	maiorideia: { desc: 'Melhor ideia do mês', points: 15, type: 'point' },
	indicacao: { desc: 'Indicação de cliente', points: 100, type: 'point' },
	erro: { desc: 'Erro cometido', points: -10, type: 'point' },
	horacurso: { desc: 'Atualização profissional', type: 'point' },
	errovalor: { desc: 'Prejuízo financeiro por erro', type: 'point' }
});

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

export function decodePushKeyTime(pushKey: string): number {
	const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
	const timeChars = pushKey.substring(0, 8);
	let timestamp = 0;
	for (let i = 0; i < 8; i++) {
		const c = timeChars.charAt(i);
		const idx = PUSH_CHARS.indexOf(c);
		if (idx < -1) {
			throw new Error(`Invalid push key at pos ${i}: ${pushKey}`);
		}
		timestamp = timestamp * 64 + idx;
	}
	return timestamp;
}

export function date(pushKey?: string): string {
	let date;
	let ms;
	if (pushKey === undefined) {
		date = new Date();
	} else {
		ms = decodePushKeyTime(pushKey);
		date = new Date(ms);
	}
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
