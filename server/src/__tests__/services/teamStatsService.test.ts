import { describe, it, expect } from '@jest/globals';
import { TeamStatsService } from '@/services/teamStatsService';

describe('TeamStatsService', () => {
	it('should return 0 total and empty members if team has no users', async () => {
		class FakeRepo {
			async getTeamMembers() {
				return [];
			}
		}

		const fakeRepo = new FakeRepo();

		const service = new TeamStatsService(fakeRepo);
		const result = await service.getStatsForTeam(1);

		expect(result.total).toBe(0);
		expect(result.members).toEqual([]);
	});

	it('should return 0 total and members of team if team has users even if they have no earnings', async () => {
		class FakeRepo {
			async getTeamMembers() {
				return [
					{ userId: 1, name: 'John Doe', totalCoins: 0 },
					{ userId: 2, name: 'Jane Doe', totalCoins: 0 },
				];
			}
		}

		const fakeRepo = new FakeRepo();

		const service = new TeamStatsService(fakeRepo);
		const result = await service.getStatsForTeam(1);

		expect(result.total).toBe(2);
		expect(result.members).toEqual([
			{ userId: 1, name: 'John Doe', totalCoins: 0 },
			{ userId: 2, name: 'Jane Doe', totalCoins: 0 },
		]);
	});
});
