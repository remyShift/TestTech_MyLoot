import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { TeamStats } from '@/types';
import { API_CONFIG } from '@/config/api';
import { AppError } from '@/types/errors';

async function fetchTeamStats(
	teamId: string,
	from?: string,
	to?: string
): Promise<TeamStats> {
	let url = `${API_CONFIG.baseUrl}/teams/${teamId}/leaderboard`;

	if (from && to) {
		url += `?from=${from}&to=${to}`;
	}

	return axios
		.get<TeamStats>(url)
		.then((response) => response.data)
		.catch((error) => {
			throw AppError.fromResponse(error);
		});
}

export function useTeamStatsQuery(teamId: string, from?: string, to?: string) {
	return useQuery({
		queryKey: ['teamStats', teamId, from, to],
		queryFn: () => fetchTeamStats(teamId, from, to),
		enabled: !!teamId,
	});
}
