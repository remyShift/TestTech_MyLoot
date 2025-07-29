import type { Member } from '@/types';

interface MemberRowProps {
	member: Member;
	rank: number;
}

export function MemberRow({ member, rank }: MemberRowProps) {
	return (
		<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-2">
			<div className="flex items-center space-x-4">
				<div className="flex-shrink-0">
					<span className="text-lg font-bold text-gray-500">#{rank}</span>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
				</div>
			</div>
			<div className="flex items-center space-x-6 text-right">
				<div>
					<p className="text-lg font-bold text-blue-600">{member.totalCoins} coins</p>
				</div>
				<div>
					<p className="text-lg font-bold text-green-600">{member.percent}%</p>
				</div>
			</div>
		</div>
	);
}