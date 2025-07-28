import { UserWithStatsAndPercent } from './domain';

export interface TeamLeaderboard {
	total: number;
	members: UserWithStatsAndPercent[];
}
