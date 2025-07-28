export interface Team {
	id: number;
	name: string;
	users: User[];
}

export interface User {
	id: number;
	name: string;
	teamId: number;
	coinEarnings: CoinEarning[];
}

export interface CoinEarning {
	id: number;
	amount: number;
	userId: number;
	date: Date;
}
