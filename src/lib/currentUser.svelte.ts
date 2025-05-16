import type { UserType, UserArray } from '$lib/types.svelte';
import { onValue, ref, getDatabase, get } from 'firebase/database';
import { faseCalc, nivelCalc, currentCalc } from '$lib/state.svelte';
export const currentUid = $state({ value: 'andreussiegrist' });
// export const currentUser = $state({ value: {} as UserType });
export const currentUser = $state({ value: {} });

export let list = $state({ value: [] as any[] });
export async function listenTotals() {
	const snap = await get(ref(getDatabase(), 'totals'));
	if (snap.exists()) {
		processData(snap.val());
		console.log(list.value);
	} else {
		console.warn('no data at initial gete()');
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

function processData(data: any) {
	list.value = Object.entries(data)
		.map(([id, total]: any) => {
			const name = names[id] ?? id;
			const fase = faseCalc(total);
			const nivel = nivelCalc(currentCalc(total, fase));
			return { id, name, fase, nivel, total };
		})
		.sort((a, b) => b.total - a.total);
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
