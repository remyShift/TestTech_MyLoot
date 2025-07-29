import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeamStatsQuery } from '../hooks/useTeamStatsQuery';
import { Loader } from '../components/Loader';
import { MemberRow } from '../components/MemberRow';
import { DateRangePicker } from '../components/DateRangePicker';
import { DevToolbar } from '../components/DevToolbar';

export function TeamPage() {
	const { id } = useParams<{ id: string }>();
	const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
	
	const { isLoading, data, error } = useTeamStatsQuery(
		id || '', 
		dateRange.from, 
		dateRange.to
	);

	const handleDateFilter = (from?: string, to?: string) => {
		setDateRange({ from, to });
	};

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
		const is404 = errorMessage.includes("doesn't exist") || errorMessage.includes("not found");
		
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
					<div className="text-center">
						<div className="text-6xl mb-4">
							{is404 ? '🔍' : '⚠️'}
						</div>
						<h1 className="text-3xl font-bold text-red-600 mb-4">
							{is404 ? 'Équipe introuvable' : 'Erreur'}
						</h1>
						<p className="text-gray-600 mb-6">
							{errorMessage}
						</p>
						<button
							onClick={() => window.location.href = '/teams/1'}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Retour à l'équipe 1
						</button>
					</div>
				</div>
				<DevToolbar />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
					<div className="text-center">
						<div className="text-6xl mb-4">📊</div>
						<h1 className="text-2xl font-bold text-gray-800 mb-4">Aucune donnée disponible</h1>
						<p className="text-gray-600 mb-6">
							Les données de cette équipe n'ont pas pu être chargées.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Réessayer
						</button>
					</div>
				</div>
				<DevToolbar />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<h1 className="text-3xl font-bold text-gray-800 mb-4">Statistiques de l'Équipe</h1>
					<div className="text-xl text-blue-600 font-semibold">
						Total: {data.total} coins
					</div>
				</div>

				<DateRangePicker onFilter={handleDateFilter} />

				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Classement des Membres</h2>
					
					{data.members.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">👥</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">Équipe vide</h3>
							<p className="text-gray-600 max-w-md mx-auto">
								Cette équipe n'a pas encore de membres ou aucun membre n'a gagné de coins 
								{dateRange.from && dateRange.to ? ' dans la période sélectionnée' : ''}.
							</p>
							{dateRange.from && dateRange.to && (
								<button
									onClick={() => setDateRange({})}
									className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								>
									Voir toutes les données
								</button>
							)}
						</div>
					) : (
						<div className="space-y-4">
							{data.members.map((member, index) => (
								<MemberRow
									key={member.id}
									member={member}
									rank={index + 1}
								/>
							))}
						</div>
					)}
				</div>
			</div>
			<DevToolbar />
		</div>
	);
}