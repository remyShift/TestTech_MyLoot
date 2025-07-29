import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { TeamPage } from '@/pages/TeamPage';
import { useTeamStatsQuery } from '@/hooks/useTeamStatsQuery';

vi.mock('@/hooks/useTeamStatsQuery');
const mockUseTeamStatsQuery = vi.mocked(useTeamStatsQuery);

let mockParams = { id: '1' };
vi.mock('react-router-dom', () => ({
	useParams: () => mockParams,
}));

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

describe('TeamPage Error Cases', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		mockParams = { id: '1' };
	});

	it('should display 404 error when team does not exist', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: new Error("Team with id 999 doesn't exist"),
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText(/Team with id 999 doesn't exist/i)).toBeInTheDocument();
		expect(screen.getByText('Team not found')).toBeInTheDocument();
	});

	it('should display specific error message for invalid team ID', () => {
		mockParams.id = 'invalid';
		
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: new Error('Team ID must be a positive integer'),
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText(/Team ID must be a positive integer/i)).toBeInTheDocument();
	});

	it('should display network error message', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: new Error('Network Error'),
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText(/network error/i)).toBeInTheDocument();
	});

	it('should display empty state with helpful message for team with no members', () => {
		const emptyTeamData = {
			total: 0,
			members: [],
		};

		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: emptyTeamData,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Team has no members')).toBeInTheDocument();
		expect(screen.getByText('Total: 0 coins')).toBeInTheDocument();
		expect(screen.getByText('Team statistics')).toBeInTheDocument();
	});

	it('should display loading state before error', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: true,
			data: undefined,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should handle undefined data gracefully', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('No data available')).toBeInTheDocument();
	});
});