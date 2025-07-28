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
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.reduce(
				(acc: number, member: TeamMember) => acc + member.totalCoins,
				0
			),
			members,
		};
	}
}
