import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '@/app';
import {
	testPrisma,
	cleanDatabase,
	disconnectTestPrisma,
} from '@/__tests__/setup-env';

const app = createApp();

describe('POST /coin_earnings - Integration Tests', () => {
	beforeEach(async () => {
		await cleanDatabase();
	});

	afterAll(async () => {
		await disconnectTestPrisma();
	});

	it('should create a coin earning and return 201', async () => {
		// Créer une équipe et un utilisateur de test
		const team = await testPrisma.team.create({
			data: {
				name: 'Test Team',
			},
		});

		const user = await testPrisma.user.create({
			data: {
				name: 'Test User',
				teamId: team.id,
			},
		});

		const response = await request(app)
			.post('/coin_earnings')
			.send({
				userId: user.id,
				amount: 150,
			})
			.expect(201);

		expect(response.body).toMatchObject({
			userId: user.id,
			amount: 150,
		});
		expect(response.body.id).toBeDefined();
		expect(response.body.date).toBeDefined();

		// Vérifier que l'earning a bien été créé en base
		const coinEarning = await testPrisma.coinEarning.findFirst({
			where: { userId: user.id },
		});
		expect(coinEarning).not.toBeNull();
		expect(coinEarning?.amount).toBe(150);
	});

	it('should return 400 when userId is invalid', async () => {
		const response = await request(app)
			.post('/coin_earnings')
			.send({
				userId: 'invalid',
				amount: 100,
			})
			.expect(400);

		expect(response.body).toEqual({
			message: 'User ID must be a positive integer',
			status: 400,
		});
	});

	it('should return 400 when amount is invalid', async () => {
		const response = await request(app)
			.post('/coin_earnings')
			.send({
				userId: 1,
				amount: -50,
			})
			.expect(400);

		expect(response.body).toEqual({
			message: 'Amount must be a positive number',
			status: 400,
		});
	});

	it('should return 404 when user does not exist', async () => {
		const response = await request(app)
			.post('/coin_earnings')
			.send({
				userId: 9999,
				amount: 100,
			})
			.expect(404);

		expect(response.body).toEqual({
			message: 'User with id 9999 does not exist',
			status: 404,
		});
	});
});