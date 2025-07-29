import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeamStatsQuery } from '@/hooks/useTeamStatsQuery';
import { Loader } from '@/components/Loader';
import { MemberRow } from '@/components/MemberRow';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DevToolbar } from '@/components/DevToolbar';
import ErrorCard from '@/components/cards/ErrorCard';
import NoTeamState from '@/components/cards/NoTeamState';
import HeaderTeamCard from '@/components/cards/HeaderTeamCard';
import EmptyTeamState from '@/components/cards/EmptyTeamState';

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
		return <ErrorCard error={error} />;
	}

	if (!data) {
		return <NoTeamState />;
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<HeaderTeamCard data={data} />

				<DateRangePicker onFilter={handleDateFilter} />

				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Members ranking</h2>
					
					{data.members.length === 0 ? (
						<EmptyTeamState dateRange={dateRange} setDateRange={setDateRange} />
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