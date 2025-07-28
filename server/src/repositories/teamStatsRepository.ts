import { PrismaClient } from '@prisma/client';
import { TeamStatsRepository, TeamMember } from '@/services/teamStatsService';
import { CoinEarning, User } from '@/types/models';

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number): Promise<TeamMember[]> {
		const users = await this.prisma.user.findMany({
			where: { teamId },
			include: {
				coinEarnings: true,
			},
		});

		return users.map((user: User) => ({
			userId: user.id,
			name: user.name,
			totalCoins: user.coinEarnings.reduce(
				(sum: number, earning: CoinEarning) => sum + earning.amount,
				0
			),
		}));
	}
}
