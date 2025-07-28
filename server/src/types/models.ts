export interface Team {
	id: number;
	name: string;
	users: User[];
}

export interface User {
	id: number;
	name: string;
	team: Team;
	teamId: number;
	coinEarnings: CoinEarning[];
}

export interface CoinEarning {
	id: number;
	amount: number;
	user: User;
	userId: number;
	date: Date;
}

export interface UserWithStats extends Omit<User, 'coinEarnings' | 'team'> {
	totalCoins: number;
}

export interface UserWithStatsAndPercent extends UserWithStats {
	percent: number;
}
