import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { createApp } from '@/app';
import { testPrisma } from '@/__tests__/setup-env';

const app = createApp();

describe('GET /teams/:id/stats', () => {
	beforeEach(async () => {
		await testPrisma.coinEarning.deleteMany();
		await testPrisma.user.deleteMany();
		await testPrisma.team.deleteMany();
	});

	it('should return team stats with proper HTTP status', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });

		const response = await request(app)
			.get(`/teams/${team.id}/stats`)
			.expect(200);

		expect(response.body).toHaveProperty('total');
		expect(response.body).toHaveProperty('members');
	});

	it('should handle team with no users', async () => {
		const team = await testPrisma.team.create({ data: { name: 'Blue' } });

		const response = await request(app)
			.get(`/teams/${team.id}/stats`)
			.expect(200);

		expect(response.body.members).toEqual([]);
		expect(response.body.total).toBe(0);
	});
});
