import { UserWithStatsAndPercent } from './domain';

export interface TeamLeaderboard {
	total: number;
	members: UserWithStatsAndPercent[];
	pagination?: {
		page: number;
		limit: number;
		totalPages: number;
		totalMembers: number;
	};
}

export interface PaginationParams {
	page?: number;
	limit?: number;
}
