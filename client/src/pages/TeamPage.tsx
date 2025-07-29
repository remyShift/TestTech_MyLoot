import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTeamStatsQuery } from '@/hooks/useTeamStatsQuery';
import { Loader } from '@/components/Loader';
import { MemberRow } from '@/components/MemberRow';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DevToolbar } from '@/components/DevToolbar';
import ErrorCard from '@/components/cards/ErrorCard';
import NoTeamState from '@/components/cards/NoTeamState';
import HeaderTeamCard from '@/components/cards/HeaderTeamCard';
import EmptyTeamState from '@/components/cards/EmptyTeamState';
import CardTitle from '@/components/cards/CardTitle';

export function TeamPage() {
	const { id } = useParams<{ id: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	
	const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({
		from: searchParams.get('from') || undefined,
		to: searchParams.get('to') || undefined,
	});
	
	const { isLoading, data, error } = useTeamStatsQuery(
		id || '', 
		dateRange.from, 
		dateRange.to
	);

	const handleDateFilter = (from?: string, to?: string) => {
		const newDateRange = { from, to };
		setDateRange(newDateRange);
		
		const newParams = new URLSearchParams(searchParams);
		if (from) {
			newParams.set('from', from);
		} else {
			newParams.delete('from');
		}
		if (to) {
			newParams.set('to', to);
		} else {
			newParams.delete('to');
		}
		setSearchParams(newParams);
	};

	useEffect(() => {
		const fromUrl = searchParams.get('from') || undefined;
		const toUrl = searchParams.get('to') || undefined;
		
		if (fromUrl !== dateRange.from || toUrl !== dateRange.to) {
			setDateRange({ from: fromUrl, to: toUrl });
		}
	}, [searchParams, dateRange.from, dateRange.to]);

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
		<div className="h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<HeaderTeamCard data={data} />

				<DateRangePicker onFilter={handleDateFilter} />

				<div className="bg-white rounded-lg shadow-lg p-6">
					<CardTitle title="Members ranking" />
					
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