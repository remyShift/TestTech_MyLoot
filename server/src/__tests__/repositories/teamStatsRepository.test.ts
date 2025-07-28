import { PrismaClient } from '@prisma/client';
import { PrismaTeamStatsRepository } from '@/repositories/prismaTeamStatsRepository';
import { expect, describe, it, beforeEach } from '@jest/globals';

const prisma = new PrismaClient();

describe('PrismaTeamStatsRepository', () => {
	beforeEach(async () => {
		await prisma.coinEarning.deleteMany();
		await prisma.user.deleteMany();
		await prisma.team.deleteMany();
	});

	it('should return empty array when team has no users', async () => {
		const team = await prisma.team.create({ data: { name: 'Red' } });

		const repo = new PrismaTeamStatsRepository(prisma);
		const result = await repo.getTeamMembers(team.id);

		expect(result).toEqual([]);
	});
});
