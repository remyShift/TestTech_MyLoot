import { describe, it, expect } from '@jest/globals';
import {
	TeamStatsService,
	TeamStatsRepository,
} from '@/services/teamStatsService';

describe('TeamStatsService', () => {
	describe('getRawStatsForTeam', () => {
		it('should return 0 total and empty members if team has no users', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
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
						{ userId: 1, name: 'John Doe', totalCoins: 0 },
						{ userId: 2, name: 'Jane Doe', totalCoins: 0 },
					];
				}
			}

			const fakeRepo = new FakeRepo();

			const service = new TeamStatsService(fakeRepo);
			const result = await service.getRawStatsForTeam(1);

			expect(result.total).toBe(0);
			expect(result.members).toEqual([
				{ userId: 1, name: 'John Doe', totalCoins: 0 },
				{ userId: 2, name: 'Jane Doe', totalCoins: 0 },
			]);
		});

		it('should return total of team earnings and members of team if team has users with earnings', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ userId: 1, name: 'John Doe', totalCoins: 10 },
						{ userId: 2, name: 'Jane Doe', totalCoins: 20 },
					];
				}
			}

			const fakeRepo = new FakeRepo();

			const service = new TeamStatsService(fakeRepo);
			const result = await service.getRawStatsForTeam(1);

			expect(result.total).toBe(30);
			expect(result.members).toEqual([
				{ userId: 1, name: 'John Doe', totalCoins: 10 },
				{ userId: 2, name: 'Jane Doe', totalCoins: 20 },
			]);
		});
	});

	describe('getSortedStatsForTeam', () => {
		it('should return members sorted by totalCoins', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ userId: 1, name: 'John', totalCoins: 10 },
						{ userId: 2, name: 'Jane', totalCoins: 30 },
						{ userId: 3, name: 'Joe', totalCoins: 10 },
					];
				}
			}

			const service = new TeamStatsService(new FakeRepo());
			const result = await service.getSortedStatsForTeam(1);

			expect(result.total).toBe(50);
			expect(result.members).toEqual([
				{ userId: 2, name: 'Jane', totalCoins: 30 },
				{ userId: 1, name: 'John', totalCoins: 10 },
				{ userId: 3, name: 'Joe', totalCoins: 10 },
			]);
		});
	});

	describe('getStatsForTeam', () => {
		it('should return members sorted by totalCoins and include percent contribution', async () => {
			class FakeRepo implements TeamStatsRepository {
				async getTeamMembers() {
					return [
						{ userId: 1, name: 'John', totalCoins: 10 },
						{ userId: 2, name: 'Jane', totalCoins: 30 },
						{ userId: 3, name: 'Joe', totalCoins: 10 },
					];
				}
			}

			const service = new TeamStatsService(new FakeRepo());
			const result = await service.getStatsForTeam(1);

			expect(result.total).toBe(50);
			expect(result.members).toEqual([
				{ userId: 2, name: 'Jane', totalCoins: 30, percent: 60 },
				{ userId: 1, name: 'John', totalCoins: 10, percent: 20 },
				{ userId: 3, name: 'Joe', totalCoins: 10, percent: 20 },
			]);
		});
	});
});
