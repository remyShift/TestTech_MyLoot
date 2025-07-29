import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TeamPage } from '../TeamPage';
import { useTeamStats } from '../../hooks/useTeamStats';

// Mock du hook
vi.mock('../../hooks/useTeamStats');
const mockUseTeamStats = vi.mocked(useTeamStats);

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
		mockUseTeamStats.mockReturnValue({
			isLoading: true,
			data: null,
			error: null,
		});

		render(<TeamPage />);

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it('should display error message when there is an error', () => {
		mockUseTeamStats.mockReturnValue({
			isLoading: false,
			data: null,
			error: 'Team not found',
		});

		render(<TeamPage />);

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

		mockUseTeamStats.mockReturnValue({
			isLoading: false,
			data: mockData,
			error: null,
		});

		render(<TeamPage />);

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

		mockUseTeamStats.mockReturnValue({
			isLoading: false,
			data: mockData,
			error: null,
		});

		render(<TeamPage />);

		expect(screen.getByText('Total: 0 coins')).toBeInTheDocument();
		expect(screen.getByText('Aucun membre dans cette équipe')).toBeInTheDocument();
	});
});