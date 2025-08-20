import { get, ref, getDatabase, child, auth } from '$lib/firebase';
import { msToString } from '$lib/time.svelte';
import {
	query,
	startAfter,
	limitToFirst,
	orderByKey,
	endBefore,
	limitToLast
} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

// Checa se o usuário é admin ou cultura
export const role = $state({ value: null as string | null });
export const authEmail: { value: string | null } = $state({ value: '' });
export const isLogged = { value: false };
export const _roleWaiter = $state({ value: [] as Array<(roleValue: string) => void> });
function resolveRole() {
	const rv = role.value ?? '';
	_roleWaiter.value.forEach((r) => {
		try {
			r(rv);
		} catch (error) {
			console.error(error);
		}
	});
	_roleWaiter.value = [];
}
if (typeof window !== 'undefined') {
	onAuthStateChanged(auth, async (user) => {
		console.log('onAuthStateChanged!!!');
		if (!user) {
			role.value = 'guest';
			resolveRole();
			return;
		}
		const uid = user.uid;
		const [globalSnap, bpoSnap, contabilSnap, cultSnap] = await Promise.all([
			get(child(dbRef, `/admins/${uid}`)),
			get(child(dbRef, `/admBpo/${uid}`)),
			get(child(dbRef, `/admContabil/${uid}`)),
			get(child(dbRef, `/admCultura/${uid}`))
		]);

		authEmail.value = user.email ?? null;
		if (globalSnap.exists()) {
			role.value = 'admin';
		} else if (bpoSnap.exists()) {
			role.value = 'bpo';
		} else if (contabilSnap.exists()) {
			role.value = 'contabil';
		} else if (cultSnap.exists()) {
			role.value = 'cultura';
		} else {
			role.value = 'user';
		}
		resolveRole();
		isLogged.value = true;
	});
}

export const homepage = $state({ value: true });

const dbRef = ref(getDatabase());
export const loading = $state({ value: false });
export const homeLoading = $state({ value: true });
export const usersArray = $state({ value: [] as any[] });
export const contabilArray = $state({ value: [] as any[] });
export const bpoArray = $state({ value: [] as any[] });
export const userLog = $state({ value: [] as any[] });

//Front-end stuff
export const totalConquistas = $state({ value: 0 });

export function sumConquistasBpo(i: number) {
	totalConquistas.value = 0;
	for (let y = 0; y < bpoArray.value?.[i].conquistas.length; y++) {
		if (bpoArray.value?.[i].conquistas[y].number > 0) {
			totalConquistas.value += bpoArray.value?.[i].conquistas[y].number;
		}
	}
}

export function sumConquistasContabil(i: number) {
	totalConquistas.value = 0;
	for (let y = 0; y < contabilArray.value?.[i].conquistas.length; y++) {
		if (contabilArray.value?.[i].conquistas[y].number > 0) {
			totalConquistas.value += contabilArray.value?.[i].conquistas[y].number;
		}
	}
}

export const logPage = $state({ value: 1 });
export const firstKey = $state({ value: null });
export const lastKey = $state({ value: null });
export const pageDirection = $state({ value: 'next' });
export const hasMore = $state({ value: false });
const pageSize = 7;

////////////////////////////////// NEW LOG CODE:
export async function checkLog(uid: string) {
	const logsRef = ref(getDatabase(), `/logs/${uid}`);
	console.log('Loading LOGS @ checkLog() in state.svelte.ts');
	loading.value = true;
	let q;
	if (logPage.value === 1) {
		q = query(logsRef, orderByKey(), limitToLast(pageSize + 1));
	} else if (pageDirection.value === 'next') {
		if (!firstKey.value) return;
		q = query(logsRef, orderByKey(), endBefore(firstKey.value), limitToLast(pageSize + 1));
	} else {
		if (!lastKey.value) return;
		q = query(logsRef, orderByKey(), startAfter(lastKey.value), limitToFirst(pageSize + 1));
	}
	const sortSnap = await get(q);
	const entries = sortSnap.exists() ? Object.entries(sortSnap.val()) : [];
	console.log('entries @ checkLog() in state.svelte.ts: ', entries);

	hasMore.value = entries.length > pageSize;

	const isForwardFetch = pageDirection.value === 'next';

	const pageItems = hasMore.value
		? isForwardFetch
			? entries.slice(0, pageSize)
			: entries.slice(1)
		: entries;

	userLog.value = pageItems
		.map(([id, entry]: [string, any]) => ({
			id,
			text: logText[entry.action]?.desc ?? '--',
			type: logText[entry.action]?.type ?? '--',
			points:
				logText[entry.action]?.points ??
				(logText[entry.action]?.img !== undefined ? logText[entry.action].img : entry.value),
			...entry
		}))
		.sort((a, b) => (a.id === b.id ? 0 : a.id < b.id ? 1 : -1));

	if (userLog.value.length) {
		lastKey.value = userLog.value[0].id;
		firstKey.value = userLog.value[userLog.value.length - 1].id;
	} else {
		hasMore.value = false;
	}
}
///////////////////////////////////////////////////

export async function checkBpo() {
	console.log('checking CheckBpo @ checkBpo() in state.svelte.ts');
	try {
		loading.value = true;
		const snapshot = await get(child(dbRef, '/bpo'));
		const data = snapshot.exists() ? snapshot.val() : null;
		bpoArray.value = Object.entries(data).map(([uid, userData]: any) => {
			const total = userData.total;
			const ingressMs = userData.ingress;
			const ingress = msToString(userData.ingress);
			const fase = faseCalc(total);
			const current = currentCalc(total, fase);
			const nivel = nivelCalc(total);
			const xp = currentXP(total, 'bpo');
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
				ingressMs,
				ingress,
				current,
				fase,
				nivel,
				xp,
				conquistas
			};
		});

		bpoArray.value = bpoArray.value.map((user, idx) => ({
			...user,
			arrayId: idx
		}));

		loading.value = false;
	} catch (error) {
		console.error(error);
	}
}

export async function checkContabil() {
	console.log('checking CheckContabil @ checkContabil() in state.svelte.ts');
	try {
		loading.value = true;
		const snapshot = await get(child(dbRef, '/contabil'));
		const data = snapshot.exists() ? snapshot.val() : null;
		contabilArray.value = Object.entries(data)
			.map(([uid, userData]: any) => {
				const isTestUser = userData.testUser;
				if (isTestUser && role.value !== 'admin') {
					console.log('SHITS FUCKED UP RN', role.value);
					return null;
				}
				const total = userData.total;
				const ingressMs = userData.ingress;
				const ingress = msToString(userData.ingress);
				const fase = faseCalc(total);
				const current = currentCalc(total, fase);
				const nivel = nivelCalc(total);
				const xp = currentXP(total);
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
					ingressMs,
					ingress,
					current,
					fase,
					nivel,
					xp,
					conquistas
				};
			})
			.filter((u) => u !== null);

		contabilArray.value = contabilArray.value.map((user, idx) => ({
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
	conqsports: {
		title: 'Move Sports',
		desc: 'Completou o desafio Move Sports',
		img: '🏃‍♂️',
		type: 'conq'
	},
	elogio: { desc: 'Elogio recebido de cliente', points: 10, type: 'point' },
	tarefas70: { desc: '70% das tarefas concluídas', points: 30, type: 'point' },
	tarefas90: { desc: '90% das tarefas concluídas', points: 70, type: 'point' },
	tarefas80: { desc: '80% das tarefas concluídas', points: 50, type: 'point' },
	tarefas100: { desc: '100% das tarefas concluídas', points: 100, type: 'point' },
	controleAtv: { desc: 'Controle de Atividades atualizado', type: 'point' },
	reclamacao: { desc: 'Reclamação de cliente', points: -10, type: 'point' },
	ideia: { desc: 'Ideia de melhoria', points: 10, type: 'point' },
	melhorideia: { desc: 'Melhor ideia do mês', points: 20, type: 'point' },
	maiorideia: { desc: 'Melhor ideia do mês', points: 15, type: 'point' },
	indicacao: { desc: 'Indicação de cliente', points: 100, type: 'point' },
	erro: { desc: 'Erro cometido', points: -10, type: 'point' },
	horacurso: { desc: 'Atualização profissional', type: 'point' },
	errovalor: { desc: 'Prejuízo financeiro por erro', type: 'point' },
	// BPO
	diafechamento: { desc: 'Dia do Fechamento', type: 'point' },
	delta: { desc: 'Redução/Aumento de Tempo', type: 'point' },
	honorario: { desc: 'Total de Honorários', type: 'point' },
	playbpodown: { desc: 'Plataforma PlayBPO incorreta', points: -30, type: 'point' },
	playbpoup: { desc: 'Plataforma PlayBPO em dia', points: 30, type: 'point' },
	indicacaoboleto: {
		desc: 'Emissão de boletos pelo Conta Azul (indicação)',
		points: 20,
		type: 'point'
	},
	primeirolugar: { desc: 'Primeiro Lugar na Campanha Mensal', points: 30, type: 'point' },
	segundolugar: { desc: 'Segundo Lugar na Campanha Mensal', points: 15, type: 'point' },
	melhorideiabpo: { desc: 'Melhor Ideia do Mês', points: 50, type: 'point' },
	ideiaaplicadabpo: { desc: 'Ideia Aplicada', points: 5, type: 'point' },
	numeroideiasbpo: { desc: 'Maior número de idéias no mês', points: 50, type: 'point' },
	falhaenvios: { desc: 'Falha no envio de vencimento ou pagamentos', points: -5, type: 'point' },
	prejuizo: { desc: 'Prejuízo', type: 'point' },
	tempogasto: { desc: 'Tempo Gasto', type: 'point' }
});

export let titlesfem: any = $state({
	fase: [
		{
			title: 'Origem dos Poderes',
			nivel: [
				'Recruta',
				'Estudante',
				'Descobrindo Habilidades',
				'Aprendiz de Herói I',
				'Aprendiz de Herói II',
				'Ajudante de Herói I',
				'Ajudante de Herói II',
				'Vigilante Local',
				'Guardiã da Vizinhança',
				'Heroína do Bairro'
			]
		},
		{
			title: 'Liga Global',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Aspirante à Patrulheira',
				'Patrulheira Nacional I',
				'Patrulheira Nacional II',
				'Heroína Nacional',
				'Guardiã Global I',
				'Guardiã Global II',
				'Sensação da Liga Global',
				'Ícone Mundial',
				'Líder da Liga Global',
				'Lenda Global'
			]
		},
		{
			title: 'Liga Galáctica',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Aspirante à Sentinela Estelar',
				'Sentinela Estelar I',
				'Sentinela Estelar II',
				'Lenda do Sistema Solar',
				'Aspirante à Guardiã Galáctica',
				'Guardiã Galáctica I',
				'Guardiã Galáctica II',
				'Comandante da Frota Galáctica',
				'Líder da Liga Galáctica',
				'Ícone Eterno da Via Láctea'
			]
		},
		{
			title: 'Liga Intergaláctica',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Viajante Intergaláctica',
				'Desbravadora Intergaláctica I',
				'Desbravadora Intergaláctica II',
				'Guardiã Intergaláctica I',
				'Guardiã Intergaláctica II',
				'Heroína de Andromeda',
				'Comandante Cósmica',
				'Símbolo Intergaláctico',
				'Líder da Liga Intergaláctica',
				'Ícone Eterno da Humanidade'
			]
		},
		{
			title: 'Lenda Universal',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Lenda Intergaláctica',
				'Dobradora do Espaço-tempo',
				'Desbravadora do Moveverso',
				'Guardiã do Moveverso',
				'Líder da Liga Interdimensional',
				'Sentinela das Realidades',
				'Eco Cósmico Interdimensional',
				'Lenda Interdimensional Atemporal',
				'Oráculo do Infinito',
				'Lenda Eterna do Moveverso'
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
				'Descobrindo Habilidades',
				'Aprendiz de Herói I',
				'Aprendiz de Herói II',
				'Ajudante de Herói I',
				'Ajudante de Herói II',
				'Vigilante Local',
				'Guardião da Vizinhança',
				'Herói do Bairro'
			]
		},
		{
			title: 'Liga Global',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Aspirante à Patrulheiro',
				'Patrulheiro Nacional I',
				'Patrulheiro Nacional II',
				'Herói Nacional',
				'Guardião Global I',
				'Guardião Global II',
				'Sensação da Liga Global',
				'Ícone Mundial',
				'Líder da Liga Global',
				'Lenda Global'
			]
		},
		{
			title: 'Liga Galáctica',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Aspirante à Sentinela Estelar',
				'Sentinela Estelar I',
				'Sentinela Estelar II',
				'Lenda do Sistema Solar',
				'Aspirante à Guardião Galáctica',
				'Guardião Galáctica I',
				'Guardião Galáctica II',
				'Comandante da Frota Galáctica',
				'Líder da Liga Galáctica',
				'Ícone Eterno da Via Láctea'
			]
		},
		{
			title: 'Liga Intergaláctica',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Viajante Intergaláctico',
				'Desbravador Intergaláctico I',
				'Desbravador Intergaláctico II',
				'Guardião Intergaláctico I',
				'Guardião Intergaláctico II',
				'Herói de Andromeda',
				'Comandante Cósmico',
				'Símbolo Intergaláctico',
				'Líder da Liga Intergaláctica',
				'Ícone Eterno da Humanidade'
			]
		},
		{
			title: 'Lenda Universal',
			nivel: [
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'Lenda Intergaláctica',
				'Dobrador do Espaço-tempo',
				'Desbravador do Moveverso',
				'Guardião do Moveverso',
				'Líder da Liga Interdimensional',
				'Sentinela das Realidades',
				'Eco Cósmico Interdimensional',
				'Lenda Interdimensional Atemporal',
				'Oráculo do Infinito',
				'Lenda Eterna do Moveverso'
			]
		}
	]
});

export function faseCalc(total: number, sector?: string) {
	const pointsPerStage = sector === 'bpo' ? 12_000 : 1_500;
	// const f = Math.floor(total / 1500);
	const f = Math.floor(total / pointsPerStage);
	const result = f > 4 ? 5 : f + 1;
	if (result < 1) return 1;
	return result;
}
export function currentCalc(total: number, fase: number, sector?: string): number {
	const pointsPerStage = sector === 'bpo' ? 12_000 : 1_500;
	// return Math.abs(1500 * fase - total - 1500);
	const result = Math.round(total - (fase - 1) * pointsPerStage);
	if (result < 0) return 0;
	return result;
}
export function currentXP(total: number, sector?: string): number {
	const pointsPerLevel = sector === 'bpo' ? 1_200 : 150;
	// return Math.abs(150 * nivel - current - 150);
	const result = Math.round(total % pointsPerLevel);
	if (result < 0) return 0;
	return result;
}
export function nivelCalc(current: number, sector?: string): number {
	const pointsPerLevel = sector === 'bpo' ? 1_200 : 150;
	const lvl = Math.floor(current / pointsPerLevel);
	const result = lvl > 49 ? 50 : lvl + 1;
	if (result < 1) return 1;
	return result;
}
