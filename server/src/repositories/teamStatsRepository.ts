import { PrismaClient } from '@prisma/client';
import { TeamStatsRepository } from '@/services/teamStatsService';
import { CoinEarning, User } from '@/types/models';

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number) {
		const team = await this.prisma.team.findUnique({
			where: { id: teamId },
		});

		if (!team) {
			throw new Error(`Error: Team with id ${teamId} doesn't exist`);
		}

		const users = await this.prisma.user.findMany({
			where: { teamId },
			include: {
				coinEarnings: true,
			},
		});

		if (users.length === 0) {
			throw new Error(`Error: No users found for team ${teamId}`);
		}

		return users.map((user: User) => {
			const { coinEarnings, ...userWithoutEarnings } = user;

			return {
				...userWithoutEarnings,
				totalCoins: coinEarnings.reduce(
					(sum: number, earning: CoinEarning) => sum + earning.amount,
					0
				),
			};
		});
	}
}
