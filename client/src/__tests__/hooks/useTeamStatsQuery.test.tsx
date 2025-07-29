import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTeamStatsQuery } from '@/hooks/useTeamStatsQuery';
import axios from 'axios';
import type { ReactNode } from 'react';

vi.mock('axios', () => ({
	default: {
		get: vi.fn(),
	},
}));

const mockedAxios = axios;

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

describe('useTeamStatsQuery Hook', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should return loading state initially', () => {
		vi.mocked(mockedAxios.get).mockImplementation(() => new Promise(() => {}));
		
		const { result } = renderHook(() => useTeamStatsQuery('1'), {
			wrapper: createWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should fetch team stats successfully', async () => {
		const mockData = {
			total: 100,
			members: [
				{
					id: 1,
					name: 'Alice',
					teamId: 1,
					totalCoins: 60,
					percent: 60,
				},
				{
					id: 2,
					name: 'Bob',
					teamId: 1,
					totalCoins: 40,
					percent: 40,
				},
			],
		};

		vi.mocked(mockedAxios.get).mockResolvedValueOnce({ data: mockData });

		const { result } = renderHook(() => useTeamStatsQuery('1'), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockData);
		expect(result.current.error).toBeNull();
		expect(mockedAxios.get).toHaveBeenCalledWith(
			'http://localhost:3000/teams/1/leaderboard'
		);
	});

	it('should fetch team stats with date range', async () => {
		const mockData = {
			total: 50,
			members: [
				{
					id: 1,
					name: 'Alice',
					teamId: 1,
					totalCoins: 30,
					percent: 60,
				},
			],
		};

		vi.mocked(mockedAxios.get).mockResolvedValueOnce({ data: mockData });

		const { result } = renderHook(() => 
			useTeamStatsQuery('1', '2024-01-01', '2024-01-31'), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockData);
		expect(mockedAxios.get).toHaveBeenCalledWith(
			'http://localhost:3000/teams/1/leaderboard?from=2024-01-01&to=2024-01-31'
		);
	});

	it('should handle errors properly', async () => {
		const errorMessage = 'Team not found';
		vi.mocked(mockedAxios.get).mockRejectedValueOnce(new Error(errorMessage));

		const { result } = renderHook(() => useTeamStatsQuery('999'), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});
});