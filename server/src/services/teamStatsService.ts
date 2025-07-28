import { UserWithStats, UserWithStatsAndPercent } from '@/types/models';
import { TeamStatsRepository } from '@/repositories/teamStatsRepository';

interface TeamStats {
	total: number;
	members: UserWithStats[];
}

interface TeamStatsWithPercent {
	total: number;
	members: UserWithStatsAndPercent[];
}

export class TeamStatsService {
	constructor(private readonly teamStatsRepository: TeamStatsRepository) {}

	async getStatsForTeam(teamId: number): Promise<TeamStatsWithPercent> {
		this.validateTeamId(teamId);

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
		this.validateTeamId(teamId);

		const members = await this.teamStatsRepository.getTeamMembers(teamId);

		return {
			total: members.reduce(
				(acc: number, member: UserWithStats) => acc + member.totalCoins,
				0
			),
			members,
		};
	}

	async getSortedStatsForTeam(teamId: number): Promise<TeamStats> {
		this.validateTeamId(teamId);

		const membersWithTotal = await this.getRawStatsForTeam(teamId);

		const sortedMembers = membersWithTotal.members.sort(
			(a, b) => b.totalCoins - a.totalCoins
		);

		return {
			total: membersWithTotal.total,
			members: sortedMembers,
		};
	}

	private validateTeamId(teamId: number): void {
		if (!Number.isInteger(teamId) || teamId <= 0) {
			throw new Error('Team ID must be a positive integer');
		}
	}
}
