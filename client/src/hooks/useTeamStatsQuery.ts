import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { TeamStats } from '@/types';

const baseUrl = 'http://localhost:3000';

async function fetchTeamStats(
	teamId: string,
	from?: string,
	to?: string
): Promise<TeamStats> {
	let url = `${baseUrl}/teams/${teamId}/leaderboard`;

	if (from && to) {
		url += `?from=${from}&to=${to}`;
	}

	return axios
		.get<TeamStats>(url)
		.then((response) => response.data)
		.then((data) => data)
		.catch((error) => {
			if (error.response?.data?.message) {
				const backendError = new Error(error.response.data.message);
				throw backendError;
			}
			throw error;
		});
}

export function useTeamStatsQuery(teamId: string, from?: string, to?: string) {
	return useQuery({
		queryKey: ['teamStats', teamId, from, to],
		queryFn: () => fetchTeamStats(teamId, from, to),
		enabled: !!teamId,
	});
}
