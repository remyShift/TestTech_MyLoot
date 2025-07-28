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

		const total = membersWithTotal.total;

		const members = membersWithTotal.members.map((member) => ({
			...member,
			percent:
				total === 0 ? 0 : Math.round((member.totalCoins / total) * 100),
		}));

		return {
			total,
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
		const membersWithTotal = await this.getTeamsInfo(teamId);

		const sortedMembers = membersWithTotal.members.sort(
			(a, b) => b.totalCoins - a.totalCoins
		);

		return {
			total: membersWithTotal.total,
			members: sortedMembers,
		};
	}
}
