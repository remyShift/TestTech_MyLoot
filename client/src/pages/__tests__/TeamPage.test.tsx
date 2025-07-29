import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { TeamPage } from '../TeamPage';
import { useTeamStatsQuery } from '../../hooks/useTeamStatsQuery';

// Mock du hook
vi.mock('../../hooks/useTeamStatsQuery');
const mockUseTeamStatsQuery = vi.mocked(useTeamStatsQuery);

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

// Mock React Router
const mockParams = { id: '1' };
vi.mock('react-router-dom', () => ({
	useParams: () => mockParams,
}));

describe('TeamPage Component', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should display loading state initially', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: true,
			data: undefined,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it('should display error message when there is an error', () => {
		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: undefined,
			error: new Error('Team not found'),
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Erreur: Team not found')).toBeInTheDocument();
	});

	it('should display team stats and members when data is loaded', async () => {
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

		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: mockData,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Statistiques de l\'Équipe')).toBeInTheDocument();
		expect(screen.getByText('Total: 100 coins')).toBeInTheDocument();
		expect(screen.getByText('Alice')).toBeInTheDocument();
		expect(screen.getByText('Bob')).toBeInTheDocument();
	});

	it('should display empty state when team has no members', () => {
		const mockData = {
			total: 0,
			members: [],
		};

		mockUseTeamStatsQuery.mockReturnValue({
			isLoading: false,
			data: mockData,
			error: null,
		} as any);

		render(<TeamPage />, { wrapper: createWrapper() });

		expect(screen.getByText('Total: 0 coins')).toBeInTheDocument();
		expect(screen.getByText('Aucun membre dans cette équipe')).toBeInTheDocument();
	});
});