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

	describe('GET /teams/:id/leaderboard?from=...&to=...', () => {
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

			const user = await testPrisma.user.create({
				data: {
					name: 'John',
					teamId: team.id,
				},
			});

			await testPrisma.coinEarning.create({
				data: {
					amount: 10,
					userId: user.id,
					date: new Date('2024-01-15'),
				},
			});

			const response = await request(app)
				.get(
					`/teams/${team.id}/leaderboard?from=2024-01-01&to=2024-01-31`
				)
				.expect(200);

			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('members');
			expect(response.body.members).toEqual([
				expect.objectContaining({
					id: user.id,
					name: 'John',
					totalCoins: 10,
					percent: 100,
				}),
			]);
		});

		it('should return 400 status when from date is invalid', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Blue' },
			});

			const response = await request(app)
				.get(`/teams/${team.id}/leaderboard?from=invalid&to=2024-01-31`)
				.expect(400);

			expect(response.body.message).toBe(
				'Invalid date format for from parameter'
			);
			expect(response.body.status).toBe(400);
		});

		it('should return 400 status when to date is invalid', async () => {
			const team = await testPrisma.team.create({
				data: { name: 'Blue' },
			});

			const response = await request(app)
				.get(`/teams/${team.id}/leaderboard?from=2024-01-01&to=invalid`)
				.expect(400);

			expect(response.body.message).toBe(
				'Invalid date format for to parameter'
			);
			expect(response.body.status).toBe(400);
		});
	});
});
