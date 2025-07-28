import { testPrisma } from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/prismaTeamStatsRepository';
import { expect, describe, it, beforeEach } from '@jest/globals';

describe('PrismaTeamStatsRepository', () => {
	beforeEach(async () => {
		await testPrisma.coinEarning.deleteMany();
		await testPrisma.user.deleteMany();
		await testPrisma.team.deleteMany();
	});

	it('should return empty array when team has no users', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Red' } });

		const repo = new PrismaTeamStatsRepository(testPrisma);
		const result = await repo.getTeamMembers(team.id);

		expect(result).toEqual([]);
	});
});
