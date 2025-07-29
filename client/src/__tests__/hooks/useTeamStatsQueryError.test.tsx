import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import axios from 'axios';
import { useTeamStatsQuery } from '@/hooks/useTeamStatsQuery';

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

describe('useTeamStatsQuery Error Handling', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should extract specific error message from backend 404 response', async () => {
		const backendError = {
			message: 'Request failed with status code 404',
			name: 'AxiosError',
			code: 'ERR_BAD_REQUEST',
			response: {
				status: 404,
				data: {
					message: "Team with id 999 doesn't exist"
				}
			}
		};

		mockedAxios.get.mockRejectedValueOnce(backendError);

		const { result } = renderHook(
			() => useTeamStatsQuery('999'),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.error?.message).toBe("Team with id 999 doesn't exist");
	});

	it('should extract specific error message from backend 400 response', async () => {
		const backendError = {
			message: 'Request failed with status code 400',
			name: 'AxiosError',
			code: 'ERR_BAD_REQUEST',
			response: {
				status: 400,
				data: {
					message: 'Team ID must be a positive integer'
				}
			}
		};

		mockedAxios.get.mockRejectedValueOnce(backendError);

		const { result } = renderHook(
			() => useTeamStatsQuery('invalid'),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.error?.message).toBe('Team ID must be a positive integer');
	});

	it('should fallback to generic message for network errors', async () => {
		const networkError = {
			message: 'Network Error',
			name: 'AxiosError',
			code: 'ERR_NETWORK',
		};

		mockedAxios.get.mockRejectedValueOnce(networkError);

		const { result } = renderHook(
			() => useTeamStatsQuery('1'),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.error?.message).toBe('Network Error');
	});

	it('should handle unexpected error format gracefully', async () => {
		const unexpectedError = new Error('Something unexpected happened');

		mockedAxios.get.mockRejectedValueOnce(unexpectedError);

		const { result } = renderHook(
			() => useTeamStatsQuery('1'),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.error?.message).toBe('Something unexpected happened');
	});
});