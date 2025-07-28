import { PrismaClient } from '@prisma/client';
import { TeamStatsRepository } from '@/services/teamStatsService';

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number) {
		return this.prisma.user.findMany({
			where: {
				teamId,
			},
		});
	}
}
