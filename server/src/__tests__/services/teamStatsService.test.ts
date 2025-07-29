import { describe, it, expect } from '@jest/globals';
import { TeamStatsService } from '@/services/teamStatsService';
import { TeamStatsRepository } from '@/repositories/teamStatsRepository';

describe('TeamStatsService', () => {
	describe('getRawStatsForTeam', () => {
		it('should return 0 total and empty members if team has no users', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}

				async getTeamMembersCount() {
					return 0;
				}

				async getTeamMembersCountWithDateFilter() {
					return 0;
				}
			}

			const fakeRepo = new FakeRepo();

			const service = new TeamStatsService(fakeRepo);
			const result = await service.getRawStatsForTeam(1);

			expect(result.total).toBe(0);
			expect(result.members).toEqual([]);
		});

		it('should return 0 total and members of team if team has users even if they have no earnings', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ id: 1, name: 'John Doe', totalCoins: 0, teamId: 1 },
						{ id: 2, name: 'Jane Doe', totalCoins: 0, teamId: 1 },
					];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}

				async getTeamMembersCount() {
					return 2;
				}

				async getTeamMembersCountWithDateFilter() {
					return 0;
				}
			}

			const fakeRepo = new FakeRepo();

			const service = new TeamStatsService(fakeRepo);
			const result = await service.getRawStatsForTeam(1);

			expect(result.total).toBe(0);
			expect(result.members).toEqual([
				{ id: 1, name: 'John Doe', totalCoins: 0, teamId: 1 },
				{ id: 2, name: 'Jane Doe', totalCoins: 0, teamId: 1 },
			]);
		});

		it('should return total of team earnings and members of team if team has users with earnings', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ id: 1, name: 'John Doe', totalCoins: 10, teamId: 1 },
						{ id: 2, name: 'Jane Doe', totalCoins: 20, teamId: 1 },
					];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}

				async getTeamMembersCount() {
					return 2;
				}

				async getTeamMembersCountWithDateFilter() {
					return 0;
				}
			}

			const fakeRepo = new FakeRepo();

			const service = new TeamStatsService(fakeRepo);
			const result = await service.getRawStatsForTeam(1);

			expect(result.total).toBe(30);
			expect(result.members).toEqual([
				{ id: 1, name: 'John Doe', totalCoins: 10, teamId: 1 },
				{ id: 2, name: 'Jane Doe', totalCoins: 20, teamId: 1 },
			]);
		});
	});

	describe('getTeamLeaderBoard', () => {
		it('should sort members from highest to lowest earnings and add percentages', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ id: 1, name: 'John Doe', totalCoins: 10, teamId: 1 },
						{ id: 2, name: 'Jane Doe', totalCoins: 40, teamId: 1 },
						{ id: 3, name: 'Bob Smith', totalCoins: 50, teamId: 1 },
					];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}

				async getTeamMembersCount() {
					return 3;
				}

				async getTeamMembersCountWithDateFilter() {
					return 0;
				}
			}

			const service = new TeamStatsService(new FakeRepo());
			const result = await service.getTeamLeaderBoard(1);

			expect(result.total).toBe(100);
			expect(result.members).toEqual([
				{
					id: 3,
					name: 'Bob Smith',
					totalCoins: 50,
					teamId: 1,
					percent: 50,
				},
				{
					id: 2,
					name: 'Jane Doe',
					totalCoins: 40,
					teamId: 1,
					percent: 40,
				},
				{
					id: 1,
					name: 'John Doe',
					totalCoins: 10,
					teamId: 1,
					percent: 10,
				},
			]);
			expect(result.pagination).toBeUndefined();
		});
	});
});
