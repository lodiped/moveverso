import { onValue, ref, getDatabase, get } from 'firebase/database';
import type { Unsubscribe } from 'firebase/auth';
import {
	faseCalc,
	nivelCalc,
	currentCalc,
	usersArray,
	bpoArray,
	contabilArray
} from '$lib/state.svelte';
export const currentUid = $state({ value: 'andreussiegrist' });
// export const currentUser = $state({ value: {} as UserType });
export const currentUser = $state({ value: {} });

export let contabilList = $state({ value: [] as any[] });
export let bpoList = $state({ value: [] as any[] });
export let list = $state({ value: [] as any[] });

let unsubscribe: Unsubscribe | null = null;
export async function listenTotals() {
	const snap = await get(ref(getDatabase(), 'totals'));
	if (snap.exists()) {
		processData(snap.val());
		console.log('list.value @ listenTotal() in currentUser.svelte.ts: ', list.value);
	} else {
		console.warn('no data at initial get()');
	}

	console.log(
		'initial fetch complete, list.value should be hydrated @ listenTotals() in currentUser.svelte.ts'
	);

	if (unsubscribe) return;
	unsubscribe = onValue(ref(getDatabase(), 'totals'), (snapshot) => {
		if (!snapshot.exists()) return;
		processData(snapshot.val());
		console.log('list.value @ onValue() in currentUser.svelte.ts: ', list.value);
		console.log(
			'onValue updated, list.value should be re-hydrated @ listenTotals()->onValue() in currentUser.svelte.ts'
		);
	});
	return unsubscribe;
}

function processData(data: Record<string, { value: number; type: string }>) {
	const all = Object.entries(data).map(([id, { value, type }]: any) => {
		const name = names[id] ?? id;
		const fase = faseCalc(value);
		const nivel = nivelCalc(currentCalc(value, fase));
		return { id, name, fase, nivel, total: value, type };
	});

	contabilList.value = all.filter((u) => u.type === 'contabil').sort((a, b) => b.total - a.total);
	bpoList.value = all.filter((u) => u.type === 'bpo').sort((a, b) => b.total - a.total);
	list.value = all;
}

export function daysSince(ms: number): number {
	const diffMs = Math.max(0, Date.now() - ms);
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	return days;
}

export function msToString(ms: number): string {
	const fmt = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	});
	return fmt.format(new Date(ms));
}

let names: Record<string, string> = {
	leticiaguidolin: 'Leticia Guidolin',
	heloisasilva: 'Heloísa Silva',
	andreussiegrist: 'Andreus Siegrist',
	cristinameyer: 'Cristina Meyer',
	fernandafrandolosobpo: 'Fernanda Frandoloso',
	francielyoliveira: 'Franciely Oliveira',
	larissamartins: 'Larissa Martins',
	leonardosilva: 'Leonardo Silva',
	lucaseyng: 'Lucas Eyng',
	luizfaquim: 'Luiz Faquim',
	philipemendes: 'Philipe Mendes',
	rafaelwolskibpo: 'Rafael Wolski',
	rafaelwolskicontabil: 'Rafael Wolski',
	robersoncorrea: 'Roberson Correa',
	alineferreira: 'Aline Ferreira',
	fernandogranciano: 'Fernando Granciano',
	cassiarodrigues: 'Cassia Rodrigues',
	ketelinnascimento: 'Ketelin Nascimento',
	lauanysantos: 'Lauany Santos',
	thiagolopes: 'Thiago Lopes',
	carolinebarros: 'Caroline Barros',
	mariawienen: 'Malu Wienen',
	eduardoditrich: 'Eduardo Ditrich',
	asaphtavares: 'Asaph Tavares',
	tamirisrosa: 'Tamiris Rosa'
};

export const pulseira = $state({
	tresMeses: {
		color: 'white',
		text: '3 Meses'
	},
	umAno: {
		color: 'yellow',
		text: '1 Ano'
	},
	doisAnos: {
		color: 'grey',
		text: '2 Anos'
	},
	tresAnos: {
		color: 'orange',
		text: '3 Anos'
	},
	quatroAnos: {
		color: 'mediumseagreen',
		text: '4 Anos'
	},
	cincoAnos: {
		color: 'dodgerblue',
		text: '5 Anos'
	},
	seisAnos: {
		color: 'purple',
		text: '6 Anos'
	},
	seteAnos: {
		color: 'brown',
		text: '7 Anos'
	},
	oitoAnos: {
		color: 'black',
		text: '8 Anos'
	},
	noveAnos: {
		color: 'red',
		text: '9 Anos'
	},
	dezAnos: {
		color: 'red',
		text: '10 Anos'
	},
	onzeAnos: {
		color: 'red',
		text: '11 Anos'
	}
});

const testing = Object.entries(pulseira).map(([key, val]) => ({
	name: key,
	...val
}));
// TODO: login para cada usuário ver o seu histórico

export async function getCultura(uid: string) {
	console.log('getting Cultura @ getCultura() in currentUser.svelte.ts');
	try {
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		const idx = usersArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			usersArray.value[idx].cultura = data;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getCulturaBpo(uid: string) {
	console.log('getting CulturaBpo @ getCulturaBpo() in currentUser.svelte.ts');
	try {
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		const idx = bpoArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			bpoArray.value[idx].cultura = data;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getCulturaContabil(uid: string) {
	try {
		console.log('\\ getting CulturaContabil @ getCulturaContabil() in currentUser.svelte.ts');
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		console.log('/ got CulturaContabil @ getCulturaContabil() in currentUser.svelte.ts');
		const idx = contabilArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			contabilArray.value[idx].cultura = data;
		}
	} catch (error) {
		console.error(error);
	}
}

export function getBandColor(timestamp: number) {
	const difference = Date.now() - timestamp * 1000;
	const differenceInMonths = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));

	if (differenceInMonths >= 3 && differenceInMonths < 12) return pulseira.tresMeses.color;
	if (differenceInMonths >= 12 && differenceInMonths < 24) return pulseira.umAno.color;
	if (differenceInMonths >= 24 && differenceInMonths < 36) return pulseira.doisAnos.color;
	if (differenceInMonths >= 36 && differenceInMonths < 48) return pulseira.tresAnos.color;
	if (differenceInMonths >= 48 && differenceInMonths < 60) return pulseira.quatroAnos.color;
	if (differenceInMonths >= 60 && differenceInMonths < 72) return pulseira.cincoAnos.color;
	if (differenceInMonths >= 72 && differenceInMonths < 84) return pulseira.seisAnos.color;
	if (differenceInMonths >= 84 && differenceInMonths < 96) return pulseira.seteAnos.color;
	if (differenceInMonths >= 96 && differenceInMonths < 108) return pulseira.oitoAnos.color;
	if (differenceInMonths >= 108 && differenceInMonths < 120) return pulseira.noveAnos.color;
	if (differenceInMonths >= 120 && differenceInMonths < 132) return pulseira.dezAnos.color;
	if (differenceInMonths >= 132 && differenceInMonths < 144) return pulseira.onzeAnos.color;
	return;
}

export function getBandName(timestamp: number) {
	const difference = Date.now() - timestamp * 1000;
	const differenceInMonths = Math.floor(difference / 2629746000);

	if (differenceInMonths >= 3 && differenceInMonths < 12) return pulseira.tresMeses.text;
	if (differenceInMonths >= 12 && differenceInMonths < 24) return pulseira.umAno.text;
	if (differenceInMonths >= 24 && differenceInMonths < 36) return pulseira.doisAnos.text;
	if (differenceInMonths >= 36 && differenceInMonths < 48) return pulseira.tresAnos.text;
	if (differenceInMonths >= 48 && differenceInMonths < 60) return pulseira.quatroAnos.text;
	if (differenceInMonths >= 60 && differenceInMonths < 72) return pulseira.cincoAnos.text;
	if (differenceInMonths >= 72 && differenceInMonths < 84) return pulseira.seisAnos.text;
	if (differenceInMonths >= 84 && differenceInMonths < 96) return pulseira.seteAnos.text;
	if (differenceInMonths >= 96 && differenceInMonths < 108) return pulseira.oitoAnos.text;
	if (differenceInMonths >= 108 && differenceInMonths < 120) return pulseira.noveAnos.text;
	if (differenceInMonths >= 120 && differenceInMonths < 132) return pulseira.dezAnos.text;
	if (differenceInMonths >= 132 && differenceInMonths < 144) return pulseira.onzeAnos.text;
}
