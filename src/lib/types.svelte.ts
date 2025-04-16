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
	date: string | null;
};
