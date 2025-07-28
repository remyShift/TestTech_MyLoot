import { testPrisma } from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { TeamStatsService } from '@/services/teamStatsService';
import { beforeEach, describe, it, expect } from '@jest/globals';

describe('TeamStatsService integration', () => {
	beforeEach(async () => {
		await testPrisma.coinEarning.deleteMany();
		await testPrisma.user.deleteMany();
		await testPrisma.team.deleteMany();
	});

	it('should return empty stats when no users', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });
		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		const stats = await service.getStatsForTeam(team.id);

		expect(stats.total).toBe(0);
		expect(stats.members).toEqual([]);
	});

	it('should sort and calculate total and percentages correctly when team has users with earnings', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });
		const user1 = await testPrisma.user.create({
			data: { name: 'Alice', teamId: team.id },
		});
		const user2 = await testPrisma.user.create({
			data: { name: 'Bob', teamId: team.id },
		});

		await testPrisma.coinEarning.create({
			data: { amount: 50, userId: user1.id },
		});
		await testPrisma.coinEarning.create({
			data: { amount: 150, userId: user2.id },
		});

		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		const stats = await service.getStatsForTeam(team.id);

		expect(stats.total).toBe(200);
		expect(stats.members).toEqual([
			expect.objectContaining({
				userId: user2.id,
				totalCoins: 150,
				percent: 75,
			}),
			expect.objectContaining({
				userId: user1.id,
				totalCoins: 50,
				percent: 25,
			}),
		]);
	});
});
