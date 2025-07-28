export interface TeamMember {
	userId: number;
	name: string;
	totalCoins: number;
}

interface TeamMemberWithPercent extends TeamMember {
	percent: number;
}

interface TeamStats {
	total: number;
	members: TeamMember[];
}

interface TeamStatsWithPercent {
	total: number;
	members: TeamMemberWithPercent[];
}

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<TeamMember[]>;
}

export class TeamStatsService {
	constructor(private readonly teamStatsRepository: TeamStatsRepository) {}

	async getStatsForTeam(teamId: number): Promise<TeamStatsWithPercent> {
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

	async getRawStatsForTeam(teamId: number): Promise<TeamStats> {
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.reduce(
				(acc: number, member: TeamMember) => acc + member.totalCoins,
				0
			),
			members,
		};
	}

	async getSortedStatsForTeam(teamId: number): Promise<TeamStats> {
		const membersWithTotal = await this.getRawStatsForTeam(teamId);

		const sortedMembers = membersWithTotal.members.sort(
			(a, b) => b.totalCoins - a.totalCoins
		);

		return {
			total: membersWithTotal.total,
			members: sortedMembers,
		};
	}
}
