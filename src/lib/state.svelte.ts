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
export let role = $state({ value: 'guest' });
if (typeof window !== 'undefined') {
	onAuthStateChanged(auth, async (user) => {
		if (!user) {
			role.value = 'guest';
			return;
		}

		const uid = user.uid;
		const [globalSnap, cultSnap] = await Promise.all([
			get(child(dbRef, `/admins/${uid}`)),
			get(child(dbRef, `/admCultura/${uid}`))
		]);

		if (globalSnap.exists()) {
			role.value = 'admin';
		} else if (cultSnap.exists()) {
			role.value = 'cultura';
		} else {
			role.value = 'guest';
		}
		console.log(
			'getting role.value @ onAuthStateChanged(auth, ()) in state.svelte.ts: ' + role.value
		);
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

export function sumConquistasCalc(i: number) {
	totalConquistas.value = 0;
	for (let y = 0; y < usersArray.value?.[i].conquistas.length; y++) {
		if (usersArray.value?.[i].conquistas[y].number > 0) {
			totalConquistas.value += usersArray.value?.[i].conquistas[y].number;
		}
	}
}

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

export async function checkLog(uid: string) {
	const logsRef = ref(getDatabase(), `/logs/${uid}`);
	console.log('checking log @ checkLog(uid) in state.svelte.ts');
	try {
		loading.value = true;
		let q;
		if (logPage.value === 1) {
			q = query(logsRef, orderByKey(), limitToLast(7));
		} else if (pageDirection.value === 'next') {
			if (!firstKey) return;
			q = query(logsRef, orderByKey(), endBefore(firstKey.value), limitToLast(7));
		} else {
			if (!lastKey) return;
			q = query(logsRef, orderByKey(), startAfter(lastKey.value), limitToFirst(7));
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
			hasMore.value = userLog.value.length === 7;
		} else {
			userLog.value = [];
		}
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
}

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
		contabilArray.value = Object.entries(data).map(([uid, userData]: any) => {
			const total = userData.total;
			const ingressMs = userData.ingress;
			const ingress = msToString(userData.ingress);
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
				ingressMs,
				ingress,
				current,
				fase,
				nivel,
				xp,
				conquistas
			};
		});

		contabilArray.value = contabilArray.value.map((user, idx) => ({
			...user,
			arrayId: idx
		}));

		loading.value = false;
	} catch (error) {
		console.error(error);
	}
}

export async function check() {
	console.log('checking Check @ check() in state.svelte.ts');
	try {
		loading.value = true;
		const snapshot = await get(child(dbRef, '/users'));
		const data = snapshot.exists() ? snapshot.val() : null;
		usersArray.value = Object.entries(data).map(([uid, userData]: any) => {
			const total = userData.total;
			const ingress = msToString(userData.ingress);
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
				ingress,
				current,
				fase,
				nivel,
				xp,
				conquistas
			};
		});

		usersArray.value = usersArray.value.map((user, idx) => ({
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
	const pointsPerStage = sector === 'bpo' ? 12000 : 1500;
	// const f = Math.floor(total / 1500);
	const f = Math.floor(total / pointsPerStage);
	return f > 4 ? 5 : f + 1;
}
export function currentCalc(total: number, fase: number, sector?: string): number {
	const pointsPerStage = sector === 'bpo' ? 12000 : 1500;
	// return Math.abs(1500 * fase - total - 1500);
	return Math.floor(total - (fase - 1) * pointsPerStage);
}
export function currentXP(current: number, nivel: number, sector?: string): number {
	const pointsPerLevel = sector === 'bpo' ? 1200 : 150;
	// return Math.abs(150 * nivel - current - 150);
	return Math.abs(current - (nivel - 1) * pointsPerLevel);
}
export function nivelCalc(current: number, sector?: string): number {
	const pointsPerLevel = sector === 'bpo' ? 1200 : 150;
	const lvl = Math.floor(current / pointsPerLevel);
	return lvl > 9 ? 10 : lvl + 1;
}
