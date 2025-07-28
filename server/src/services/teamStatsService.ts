export class TeamStatsService {
	constructor(private readonly teamStatsRepository: any) {}

	async getStatsForTeam(teamId: number) {
		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.length,
			members,
		};
	}
}
