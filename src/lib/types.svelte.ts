export type Log = {
	date: string;
	text: string;
	points: number;
	type: string;
};

export type BaseConquista = {
	title: string;
	desc: string;
	img: string;
};

export type UserConquista = BaseConquista & {
	number: number;
	id: string;
};

export type UserType = {
	id: string;
	ingress: string;
	name: string;
	fase: number;
	nivel: number;
	xp: number;
	total: number;
	current: number;
	gender: string;
	conquistas: UserConquista[];
};
