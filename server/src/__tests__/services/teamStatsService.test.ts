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

	describe('getSortedStatsForTeam', () => {
		it('should return members sorted by totalCoins', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ id: 1, name: 'John', totalCoins: 10, teamId: 1 },
						{ id: 2, name: 'Jane', totalCoins: 30, teamId: 1 },
						{ id: 3, name: 'Joe', totalCoins: 10, teamId: 1 },
					];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}
			}

			const service = new TeamStatsService(new FakeRepo());
			const result = await service.getSortedStatsForTeam(1);

			expect(result.total).toBe(50);
			expect(result.members).toEqual([
				{ id: 2, name: 'Jane', totalCoins: 30, teamId: 1 },
				{ id: 1, name: 'John', totalCoins: 10, teamId: 1 },
				{ id: 3, name: 'Joe', totalCoins: 10, teamId: 1 },
			]);
		});
	});

	describe('getTeamLeaderBoard', () => {
		it('should return members sorted by totalCoins and include percent contribution', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ id: 1, name: 'John', totalCoins: 10, teamId: 1 },
						{ id: 2, name: 'Jane', totalCoins: 30, teamId: 1 },
						{ id: 3, name: 'Joe', totalCoins: 10, teamId: 1 },
					];
				}

				async getTeamMembersWithDateFilter() {
					return [];
				}
			}

			const service = new TeamStatsService(new FakeRepo());
			const result = await service.getTeamLeaderBoard(1);

			expect(result.total).toBe(50);
			expect(result.members).toEqual([
				{ id: 2, name: 'Jane', totalCoins: 30, percent: 60, teamId: 1 },
				{ id: 1, name: 'John', totalCoins: 10, percent: 20, teamId: 1 },
				{ id: 3, name: 'Joe', totalCoins: 10, percent: 20, teamId: 1 },
			]);
		});
	});
});
