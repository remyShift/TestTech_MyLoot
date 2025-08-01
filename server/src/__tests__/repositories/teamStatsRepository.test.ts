import {
	testPrisma,
	cleanDatabase,
	disconnectTestPrisma,
} from '@/__tests__/setup-env';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { expect, describe, it, beforeEach, afterAll } from '@jest/globals';

describe('PrismaTeamStatsRepository', () => {
	describe('getTeamMembers', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		afterAll(async () => {
			await disconnectTestPrisma();
		});

		it('should return an error when team does not exist', async () => {
			const repo = new PrismaTeamStatsRepository(testPrisma);
			await expect(repo.getTeamMembers(1)).rejects.toThrow(
				"Team with id 1 doesn't exist"
			);
		});

		it('should return an empty array when team has no users', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembers(team.id);

			expect(result).toEqual([]);
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

		it('should return one member with 0 coins if user has no earnings', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});

			const user = await testPrisma.user.create({
				data: {
					name: 'Alice',
					teamId: team.id,
				},
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembers(team.id);

			expect(result).toEqual([
				{ ...user, totalCoins: 0, teamId: team.id },
			]);
		});
	});

	describe('getTeamMembersWithDateFilter', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		afterAll(async () => {
			await disconnectTestPrisma();
		});

		it('should return team members without earnings in date range with a total of 0', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});
			const user = await testPrisma.user.create({
				data: { name: 'John', teamId: team.id },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembersWithDateFilter(
				team.id,
				new Date('2024-01-10'),
				new Date('2024-01-20')
			);

			expect(result).toEqual([
				{ ...user, totalCoins: 0, teamId: team.id },
			]);
		});

		it('should return team members with earnings in date range', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});
			const user = await testPrisma.user.create({
				data: { name: 'John', teamId: team.id },
			});

			const earlyDate = new Date('2024-01-01');
			const targetDate = new Date('2024-01-15');
			const lateDate = new Date('2024-02-01');

			await testPrisma.coinEarning.create({
				data: { amount: 50, userId: user.id, date: earlyDate },
			});
			await testPrisma.coinEarning.create({
				data: { amount: 100, userId: user.id, date: targetDate },
			});
			await testPrisma.coinEarning.create({
				data: { amount: 75, userId: user.id, date: lateDate },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembersWithDateFilter(
				team.id,
				new Date('2024-01-10'),
				new Date('2024-01-20')
			);

			expect(result).toEqual([
				{ ...user, totalCoins: 100, teamId: team.id },
			]);
		});

		it('should return an empty array when team has no users', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Red' },
			});

			const repo = new PrismaTeamStatsRepository(testPrisma);
			const result = await repo.getTeamMembersWithDateFilter(
				team.id,
				new Date('2024-01-10'),
				new Date('2024-01-20')
			);

			expect(result).toEqual([]);
		});
	});
});
