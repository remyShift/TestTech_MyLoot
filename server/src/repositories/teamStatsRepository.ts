import { PrismaClient } from '@prisma/client';
import { TeamStatsRepository } from '@/services/teamStatsService';
import { CoinEarning, User } from '@/types/models';

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number) {
		const users = await this.prisma.user.findMany({
			where: { teamId },
			include: {
				coinEarnings: true,
			},
		});

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
