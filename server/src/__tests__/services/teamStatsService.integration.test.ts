import { testPrisma } from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { TeamStatsService } from '@/services/teamStatsService';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('TeamStatsService integration', () => {
	beforeEach(async () => {
		await testPrisma.team.deleteMany();

		await testPrisma.$executeRaw`ALTER SEQUENCE "Team_id_seq" RESTART WITH 1`;
		await testPrisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
		await testPrisma.$executeRaw`ALTER SEQUENCE "CoinEarning_id_seq" RESTART WITH 1`;
	});

	it('should return an error when team does not exist', async () => {
		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		await expect(service.getStatsForTeam(1)).rejects.toThrow(
			`Team with id 1 doesn't exist`
		);
	});

	it('should return an empty array when team has no users', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });
		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		const result = await service.getStatsForTeam(team.id);

		expect(result.members).toEqual([]);
		expect(result.total).toBe(0);
	});

	it('should sort and calculate total and percentages correctly when team has users with earnings', async () => {
		const result = await testPrisma.$transaction(async (tx) => {
			const team = await tx.team.create({ data: { name: 'Blue' } });

			const user1 = await tx.user.create({
				data: { name: 'Alice', teamId: team.id },
			});
			const user2 = await tx.user.create({
				data: { name: 'Bob', teamId: team.id },
			});

			await tx.coinEarning.create({
				data: { amount: 50, userId: user1.id },
			});
			await tx.coinEarning.create({
				data: { amount: 150, userId: user2.id },
			});

			return { team, user1, user2 };
		});

		const repo = new PrismaTeamStatsRepository(testPrisma);
		const service = new TeamStatsService(repo);

		const stats = await service.getStatsForTeam(result.team.id);

		expect(stats.total).toBe(200);
		expect(stats.members).toEqual([
			expect.objectContaining({
				id: result.user2.id,
				name: 'Bob',
				teamId: result.team.id,
				totalCoins: 150,
				percent: 75,
			}),
			expect.objectContaining({
				id: result.user1.id,
				name: 'Alice',
				teamId: result.team.id,
				totalCoins: 50,
				percent: 25,
			}),
		]);
	});
});
