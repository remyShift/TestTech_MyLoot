import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { TeamStats } from '@/types';

async function fetchTeamStats(
	teamId: string,
	from?: string,
	to?: string
): Promise<TeamStats> {
	let url = `http://localhost:3000/teams/${teamId}/leaderboard`;

	if (from && to) {
		url += `?from=${from}&to=${to}`;
	}

	const response = await axios.get<TeamStats>(url);
	return response.data;
}

export function useTeamStatsQuery(teamId: string, from?: string, to?: string) {
	return useQuery({
		queryKey: ['teamStats', teamId, from, to],
		queryFn: () => fetchTeamStats(teamId, from, to),
		enabled: !!teamId,
	});
}
