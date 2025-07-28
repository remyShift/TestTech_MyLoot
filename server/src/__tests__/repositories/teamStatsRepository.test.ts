import { testPrisma } from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { expect, describe, it, beforeEach } from '@jest/globals';

describe('PrismaTeamStatsRepository', () => {
	describe('getTeamMembers', () => {
		beforeEach(async () => {
			await testPrisma.coinEarning.deleteMany();
			await testPrisma.user.deleteMany();
			await testPrisma.team.deleteMany();
		});

		it('should return an error when team does not exist', async () => {
			const repo = new PrismaTeamStatsRepository(testPrisma);
			await expect(repo.getTeamMembers(1)).rejects.toThrow(
				"Error: Team with id 1 doesn't exist"
			);
		});

		it('should return an error when team has no users', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			await expect(repo.getTeamMembers(team.id)).rejects.toThrow(
				`Error: No users found for team ${team.id}`
			);
		});

		it('should return team members when team has users without coin earnings', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});
			const user = await testPrisma.user.create({
				data: { name: 'John', teamId: team.id },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembers(team.id);

			expect(result).toEqual([
				{ ...user, totalCoins: 0, teamId: team.id },
			]);
		});

		it('should return team members when team has users with coin earnings', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});
			const user = await testPrisma.user.create({
				data: { name: 'John', teamId: team.id },
			});
			await testPrisma.coinEarning.create({
				data: { amount: 100, userId: user.id },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembers(team.id);

			expect(result).toEqual([
				{ ...user, totalCoins: 100, teamId: team.id },
			]);
		});
	});
});
