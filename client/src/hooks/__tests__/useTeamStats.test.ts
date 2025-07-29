import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTeamStats } from '../useTeamStats';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('useTeamStats Hook', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() => useTeamStats('1'));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBe(null);
		expect(result.current.error).toBe(null);
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

		mockedAxios.get.mockResolvedValueOnce({ data: mockData });

		const { result } = renderHook(() => useTeamStats('1'));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockData);
		expect(result.current.error).toBe(null);
		expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/teams/1/leaderboard');
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

		mockedAxios.get.mockResolvedValueOnce({ data: mockData });

		const { result } = renderHook(() => 
			useTeamStats('1', '2024-01-01', '2024-01-31')
		);

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
		mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

		const { result } = renderHook(() => useTeamStats('999'));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBe(null);
		expect(result.current.error).toBe(errorMessage);
	});
});