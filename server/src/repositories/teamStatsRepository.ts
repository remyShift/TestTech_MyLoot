import { PrismaClient } from '@prisma/client';
import { UserWithStats } from '@/types/domain';
import { User, CoinEarning } from '@/types/models';

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<UserWithStats[]>;
}

type DBUser = User & {
	coinEarnings: CoinEarning[];
};

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number): Promise<UserWithStats[]> {
		this.validateTeamId(teamId);

		const team = await this.prisma.team.findUnique({
			where: { id: teamId },
		});

		if (!team) {
			throw new Error(`Error: Team with id ${teamId} doesn't exist`);
		}

		const users: DBUser[] = await this.prisma.user.findMany({
			where: { teamId },
			include: {
				coinEarnings: true,
			},
		});

		if (users.length === 0) {
			return [];
		}

		return users.map((user: DBUser) => {
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

	private validateTeamId(teamId: number): void {
		if (!Number.isInteger(teamId) || teamId <= 0) {
			throw new Error('Team ID must be a positive integer');
		}
	}
}
