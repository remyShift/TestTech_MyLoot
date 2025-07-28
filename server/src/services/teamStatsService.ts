export class TeamStatsService {
	constructor(private readonly teamStatsRepository: any) {}

	async getStatsForTeam(teamId: number) {
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.reduce(
				(acc: number, member: any) => acc + member.totalCoins,
				0
			),
			members,
		};
	}
}
