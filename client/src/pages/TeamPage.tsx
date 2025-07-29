import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeamStatsQuery } from '../hooks/useTeamStatsQuery';
import { Loader } from '../components/Loader';
import { MemberRow } from '../components/MemberRow';
import { DateRangePicker } from '../components/DateRangePicker';

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
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Erreur: {error instanceof Error ? error.message : 'Une erreur est survenue'}
					</h1>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">Aucune donnée disponible</h1>
				</div>
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
						<p className="text-gray-600 text-center py-8">Aucun membre dans cette équipe</p>
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
		</div>
	);
}