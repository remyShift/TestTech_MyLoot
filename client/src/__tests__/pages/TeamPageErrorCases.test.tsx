import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { TeamPage } from '../../pages/TeamPage';
import { useTeamStatsQuery } from '../../hooks/useTeamStatsQuery';

// Mock du hook
vi.mock('../../hooks/useTeamStatsQuery');
const mockUseTeamStatsQuery = vi.mocked(useTeamStatsQuery);

// Mock React Router avec différents IDs
let mockParams = { id: '1' };
vi.mock('react-router-dom', () => ({
	useParams: () => mockParams,
}));

// Wrapper pour React Query
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
		mockParams = { id: '1' }; // Reset to default
	});

	it('should display 404 error when team does not exist', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: new Error("Team with id 999 doesn't exist"),
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText(/Team with id 999 doesn't exist/i)).toBeInTheDocument();
		expect(screen.getByText('Équipe introuvable')).toBeInTheDocument();
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

		expect(screen.getByText('Équipe vide')).toBeInTheDocument();
		expect(screen.getByText('Total: 0 coins')).toBeInTheDocument();
		expect(screen.getByText('Statistiques de l\'Équipe')).toBeInTheDocument();
	});

	it('should display loading state before error', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: true,
			data: undefined,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it('should handle undefined data gracefully', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
	});
});