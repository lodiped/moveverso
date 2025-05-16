export function decodePushKeyTime(pushKey: string): number {
	const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
	const timeChars = pushKey.substring(0, 8);
	let timestamp = 0;
	for (let i = 0; i < 8; i++) {
		const c = timeChars.charAt(i);
		const idx = PUSH_CHARS.indexOf(c);
		if (idx === -1) {
			throw new Error(`Invalid push key at pos ${i}: ${pushKey}`);
		}
		timestamp = timestamp * 64 + idx;
	}
	return timestamp;
}

export function daysSince(ms: number): number {
	const diffMs = Math.max(0, Date.now() - ms);
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	return days;
}

export function msToString(ms: number): string {
	ms = ms * 1000 + 90000000;
	if (!Number.isFinite(ms)) {
		console.warn('invalid ms', ms);
		return '';
	}
	const date = new Date(ms);
	return date.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	});
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
