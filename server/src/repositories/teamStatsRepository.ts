import { PrismaClient } from '@prisma/client';
import { UserWithStats } from '@/types/domain';
import { CoinEarning, User } from '@/types/models';
import { NotFoundError } from '@/utils/errors';

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<UserWithStats[]>;
}

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number): Promise<UserWithStats[]> {
		const result = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: {
				users: {
					include: {
						coinEarnings: true,
					},
				},
			},
		});

		if (!result) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return result.users.map((user: User) => {
			const { coinEarnings, ...userWithoutEarnings } = user;

			return {
				...userWithoutEarnings,
				totalCoins: coinEarnings.reduce(
					(sum: number, earning: CoinEarning) => sum + earning.amount,
					0
				),
			} as UserWithStats;
		});
	}
}
