interface TeamMember {
	userId: number;
	name: string;
	totalCoins: number;
}

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<TeamMember[]>;
}

export class TeamStatsService {
	constructor(private readonly teamStatsRepository: TeamStatsRepository) {}

	async getStatsForTeam(teamId: number) {
		const membersWithTotal = await this.getSortedStatsForTeam(teamId);

		const members = membersWithTotal.members.map((member) => ({
			...member,
			percent:
				membersWithTotal.total === 0
					? 0
					: Math.round(
							(member.totalCoins / membersWithTotal.total) * 100
					  ),
		}));

		members.sort((a, b) => b.totalCoins - a.totalCoins);

		return {
			total: membersWithTotal.total,
			members,
		};
	}

	async getTeamsInfo(teamId: number) {
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.reduce(
				(acc: number, member: TeamMember) => acc + member.totalCoins,
				0
			),
			members,
		};
	}

	async getSortedStatsForTeam(teamId: number) {
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		const total = members.reduce(
			(acc: number, member: TeamMember) => acc + member.totalCoins,
			0
		);

		members.sort((a, b) => b.totalCoins - a.totalCoins);

		return {
			total,
			members,
		};
	}
}
