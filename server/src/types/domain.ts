import { User } from '@/types/models';

export interface UserWithStats extends Omit<User, 'coinEarnings' | 'team'> {
	totalCoins: number;
}

export interface UserWithStatsAndPercent extends UserWithStats {
	percent: number;
}
