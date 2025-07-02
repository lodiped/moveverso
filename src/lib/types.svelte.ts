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

type Cultura = {
	media: string;
	coins: {
		entregues: number;
		recebidas: number;
	};
	presenca: {
		cumbuca: number;
		treinamento: number;
	};
	sports: {
		conq: boolean;
		presente: boolean;
	};
};

export type UserType = {
	id: string;
	ingressMs: number;
	ingress: string;
	name: string;
	fase: number;
	nivel: number;
	xp: number;
	total: number;
	current: number;
	gender: string;
	email: string;
	arrayId: number;
	cultura: Cultura;
	log: Log[];
	conquistas: UserConquista[];
};

export type UserArray = UserType[];
