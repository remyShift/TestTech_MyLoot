import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { createApp } from '@/app';
import {
	testPrisma,
	cleanDatabase,
	disconnectTestPrisma,
} from '@/__tests__/setup-env';

const app = createApp();

describe('team leaderboard controller', () => {
	describe('GET /teams/:id/leaderboard', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		afterAll(async () => {
			await disconnectTestPrisma();
		});

		it('should return team leaderboard with proper HTTP status', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Blue' },
			});

			const response = await request(app)
				.get(`/teams/${team.id}/leaderboard`)
				.expect(200);

			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('members');
		});

		it('should return empty leaderboard when team has no users', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Blue' },
			});

			const response = await request(app)
				.get(`/teams/${team.id}/leaderboard`)
				.expect(200);

			expect(response.body.members).toEqual([]);
			expect(response.body.total).toBe(0);
		});
	});
});
