import {
	testPrisma,
	cleanDatabase,
	disconnectTestPrisma,
} from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { TeamStatsService } from '@/services/teamStatsService';
import { beforeEach, describe, expect, it, afterAll } from '@jest/globals';

describe('TeamStatsService integration', () => {
	beforeEach(async () => {
		await cleanDatabase();
	});

	afterAll(async () => {
		await disconnectTestPrisma();
	});

	it('should return an error when team does not exist', async () => {
		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		await expect(service.getTeamLeaderBoard(1)).rejects.toThrow(
			`Team with id 1 doesn't exist`
		);
	});

	it('should return an empty array when team has no users', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });
		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		const result = await service.getTeamLeaderBoard(team.id);

		expect(result.members).toEqual([]);
		expect(result.total).toBe(0);
	});

	it('should sort and calculate total and percentages correctly when team has users with earnings', async () => {
		// Create data without transaction to ensure it's committed
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

		const stats = await service.getTeamLeaderBoard(team.id);

		expect(stats.total).toBe(200);
		expect(stats.members).toEqual([
			expect.objectContaining({
				id: user2.id,
				name: 'Bob',
				teamId: team.id,
				totalCoins: 150,
				percent: 75,
			}),
			expect.objectContaining({
				id: user1.id,
				name: 'Alice',
				teamId: team.id,
				totalCoins: 50,
				percent: 25,
			}),
		]);
	});
});
