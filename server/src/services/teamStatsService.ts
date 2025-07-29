import { UserWithStats, UserWithStatsAndPercent } from '@/types/domain';
import { TeamStatsRepository } from '@/repositories/teamStatsRepository';
import { TeamLeaderboard } from '@/types/api';

interface TeamStats {
	total: number;
	members: UserWithStats[];
}

export class TeamStatsService {
	constructor(private readonly teamStatsRepository: TeamStatsRepository) {}

	async getTeamLeaderBoard(
		teamId: number,
		from?: Date,
		to?: Date
	): Promise<TeamLeaderboard> {
		const membersWithTotal =
			from && to
				? await this.getRawStatsForTeamWithDateFilter(teamId, from, to)
				: await this.getRawStatsForTeam(teamId);

		const total = membersWithTotal.total;

		const members = await this.insertMembersPercent(
			membersWithTotal.members
		);

		const sortedMembers = await this.sortMembersByTotalEarnings(members);

		return {
			total,
			members: sortedMembers,
		};
	}

	async sortMembersByTotalEarnings(
		members: UserWithStatsAndPercent[]
	): Promise<UserWithStatsAndPercent[]> {
		return members.sort((a, b) => b.totalCoins - a.totalCoins);
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

	async getRawStatsForTeamWithDateFilter(
		teamId: number,
		from: Date,
		to: Date
	): Promise<TeamStats> {
		const members =
			await this.teamStatsRepository.getTeamMembersWithDateFilter(
				teamId,
				from,
				to
			);

		return {
			total: members.reduce(
				(acc: number, member: UserWithStats) => acc + member.totalCoins,
				0
			),
			members,
		};
	}

	private async insertMembersPercent(
		members: UserWithStats[]
	): Promise<UserWithStatsAndPercent[]> {
		const total = members.reduce(
			(acc: number, member: UserWithStats) => acc + member.totalCoins,
			0
		);

		return members.map((member) => ({
			...member,
			percent:
				total === 0 ? 0 : Math.round((member.totalCoins / total) * 100),
		}));
	}
}
