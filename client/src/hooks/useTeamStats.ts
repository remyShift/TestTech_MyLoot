import { useState, useEffect } from 'react';
import axios from 'axios';
import type { TeamStats } from '@/types';

interface UseTeamStatsResult {
	isLoading: boolean;
	data: TeamStats | null;
	error: string | null;
}

export function useTeamStats(
	teamId: string,
	from?: string,
	to?: string
): UseTeamStatsResult {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<TeamStats | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTeamStats = async () => {
			setIsLoading(true);
			setError(null);

			try {
				let url = `http://localhost:3000/teams/${teamId}/leaderboard`;

				if (from && to) {
					url += `?from=${from}&to=${to}`;
				}

				const response = await axios.get<TeamStats>(url);
				setData(response.data);
			} catch (err: any) {
				setError(err.message);
				setData(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTeamStats();
	}, [teamId, from, to]);

	return { isLoading, data, error };
}
