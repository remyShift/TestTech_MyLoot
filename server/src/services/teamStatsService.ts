import { UserWithStats, UserWithStatsAndPercent } from '@/types/models';

interface TeamStats {
	total: number;
	members: UserWithStats[];
}

interface TeamStatsWithPercent {
	total: number;
	members: UserWithStatsAndPercent[];
}

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<UserWithStats[]>;
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
				(acc: number, member: UserWithStats) => acc + member.totalCoins,
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
