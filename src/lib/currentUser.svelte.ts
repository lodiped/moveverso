import type { UserType, UserArray } from '$lib/types.svelte';
import { onValue, ref, getDatabase, get } from 'firebase/database';
import {
	faseCalc,
	nivelCalc,
	currentCalc,
	userArray,
	bpoArray,
	contabilArray
} from '$lib/state.svelte';
export const currentUid = $state({ value: 'andreussiegrist' });
// export const currentUser = $state({ value: {} as UserType });
export const currentUser = $state({ value: {} });

export let contabilList = $state({ value: [] as any[] });
export let bpoList = $state({ value: [] as any[] });
export let list = $state({ value: [] as any[] });
export async function listenTotals() {
	const snap = await get(ref(getDatabase(), 'totals'));
	if (snap.exists()) {
		processData(snap.val());
		console.log(list.value);
	} else {
		console.warn('no data at initial get()');
	}

	console.log('initial fetch complete, list.value show be hydrated');

	const unsubscribe = onValue(ref(getDatabase(), 'totals'), (snapshot) => {
		if (!snapshot.exists()) return;
		processData(snapshot.val());
		console.log(list.value);
		console.log('onValue updated, list.value should re-hydrated');
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
	andreussiegrist: 'Andreus Siegrist',
	arthurrezner: 'Arthur Rezner',
	cristinameyer: 'Cristina Meyer',
	fernandafrandoloso: 'Fernanda Frandoloso',
	francielyoliveira: 'Franciely Oliveira',
	larissamartins: 'Larissa Martins',
	lucaseyng: 'Lucas Eyng',
	luizfaquim: 'Luiz Faquim',
	philipemendes: 'Philipe Mendes',
	rafaelwolski: 'Rafael Wolski',
	robersoncorrea: 'Roberson Correa',
	tamirisrosa: 'Tamiris Rosa',
	xexeu: 'Michael Henning',
	jessicanunes: 'Jessica Nunes'
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
		color: 'green',
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

// TODO: login para cada usuário ver o seu histórico

export async function getCultura(uid: string) {
	console.log('getting Cultura');
	try {
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		console.log(data);
		console.log(userArray.value);
		const idx = userArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			userArray.value[idx].cultura = data;
		}
		console.log(userArray.value);
	} catch (error) {
		console.log('error getting cultura try/catch');
		console.error(error);
	}
}

export async function getCulturaBpo(uid: string) {
	console.log('getting CulturaBpo');
	try {
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		console.log(data);
		console.log(bpoArray.value);
		const idx = bpoArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			bpoArray.value[idx].cultura = data;
		}
		console.log(bpoArray.value);
	} catch (error) {
		console.log('error getting culturaBpo try/catch');
		console.error(error);
	}
}

export async function getCulturaContabil(uid: string) {
	console.log('getting CulturaBpo');
	try {
		const snapshot = await get(ref(getDatabase(), `cultura/${uid}`));
		const data = snapshot.exists() ? snapshot.val() : null;
		console.log(data);
		console.log(contabilArray.value);
		const idx = contabilArray.value.findIndex((u) => u.id === uid);
		if (idx < 0) {
			return;
		}
		if (data) {
			contabilArray.value[idx].cultura = data;
		}
		console.log(contabilArray.value);
	} catch (error) {
		console.log('error getting culturaBpo try/catch');
		console.error(error);
	}
}
