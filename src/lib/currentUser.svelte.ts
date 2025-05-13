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
