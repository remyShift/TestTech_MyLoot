interface Member {
	id: number;
	name: string;
	totalCoins: number;
	percent: number;
}

interface MemberRowProps {
	member: Member;
	rank: number;
}

export function MemberRow({ member, rank }: MemberRowProps) {
	const getRankEmoji = (rank: number) => {
		switch (rank) {
			case 1: return '🥇';
			case 2: return '🥈';
			case 3: return '🥉';
			default: return '👤';
		}
	};

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1: return 'bg-yellow-50 border-yellow-200';
			case 2: return 'bg-gray-50 border-gray-200';
			case 3: return 'bg-orange-50 border-orange-200';
			default: return 'bg-white border-gray-200';
		}
	};

	return (
		<div 
			className={`p-4 rounded-lg border-2 ${getRankColor(rank)} hover:shadow-md transition-shadow`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span 
							className="text-2xl" 
						>
							{getRankEmoji(rank)}
						</span>
						<span 
							className="text-lg font-bold text-gray-600"
						>
							#{rank}
						</span>
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-800">
							{member.name}
						</h3>
					</div>
				</div>
				
				<div className="text-right">
					<div className="text-2xl font-bold text-blue-600">
						{member.totalCoins} coins
					</div>
					<div className="text-sm text-gray-500">
						{member.percent}% of team
					</div>
				</div>
			</div>
		</div>
	);
}