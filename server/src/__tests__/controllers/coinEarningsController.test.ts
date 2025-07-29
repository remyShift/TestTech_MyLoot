import { describe, it, expect } from '@jest/globals';
import { Request, Response } from 'express';
import { CoinEarningsController } from '@/controllers/coinEarningsController';
import { CoinEarningsService } from '@/services/coinEarningsService';
import { CoinEarningsRepository } from '@/repositories/coinEarningsRepository';
import { NotFoundError } from '@/utils/errors';

describe('CoinEarningsController', () => {
	describe('createCoinEarning', () => {
		it('should create a coin earning and return 201 with the created earning', async () => {
			const mockEarning = {
				id: 1,
				userId: 1,
				amount: 100,
				date: new Date('2024-01-01T10:00:00Z'),
			};

			const mockRepository = {
				createCoinEarning: jest.fn().mockResolvedValue(mockEarning),
			} as unknown as CoinEarningsRepository;

			const service = new CoinEarningsService(mockRepository);
			const controller = new CoinEarningsController(service);

			const req = Object.assign({} as Request, {
				body: {
					userId: 1,
					amount: 100,
				},
			});

			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.createCoinEarning(req, res);

			expect(mockRepository.createCoinEarning).toHaveBeenCalledWith(1, 100);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(mockEarning);
		});

		it('should return 400 when userId is not a positive integer', async () => {
			const mockRepository = {
				createCoinEarning: jest.fn(),
			} as unknown as CoinEarningsRepository;

			const service = new CoinEarningsService(mockRepository);
			const controller = new CoinEarningsController(service);

			const req = Object.assign({} as Request, {
				body: {
					userId: 'invalid',
					amount: 100,
				},
			});

			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.createCoinEarning(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: 'User ID must be a positive integer',
				status: 400,
			});
			expect(mockRepository.createCoinEarning).not.toHaveBeenCalled();
		});

		it('should return 400 when amount is not a positive number', async () => {
			const mockRepository = {
				createCoinEarning: jest.fn(),
			} as unknown as CoinEarningsRepository;

			const service = new CoinEarningsService(mockRepository);
			const controller = new CoinEarningsController(service);

			const req = Object.assign({} as Request, {
				body: {
					userId: 1,
					amount: -50,
				},
			});

			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.createCoinEarning(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Amount must be a positive number',
				status: 400,
			});
			expect(mockRepository.createCoinEarning).not.toHaveBeenCalled();
		});

		it('should return 404 when user does not exist', async () => {
			const mockRepository = {
				createCoinEarning: jest
					.fn()
					.mockRejectedValue(
						new NotFoundError('User with id 999 does not exist')
					),
			} as unknown as CoinEarningsRepository;

			const service = new CoinEarningsService(mockRepository);
			const controller = new CoinEarningsController(service);

			const req = Object.assign({} as Request, {
				body: {
					userId: 999,
					amount: 100,
				},
			});

			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.createCoinEarning(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: 'User with id 999 does not exist',
				status: 404,
			});
		});
	});
});
