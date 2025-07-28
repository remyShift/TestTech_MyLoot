import { describe, it, expect } from '@jest/globals';
import { Request, Response } from 'express';
import { TeamStatsController } from '@/controllers/teamStatsController';
import { TeamStatsService } from '@/services/teamStatsService';
import { NotFoundError } from '@/utils/errors';

describe('TeamStatsController', () => {
	describe('getTeamStats', () => {
		it('should return 400 when teamId is not a valid number', async () => {
			const mockService = {
				getStatsForTeam: jest.fn(),
			} as unknown as TeamStatsService;

			const controller = new TeamStatsController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: 'toto' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getTeamStats(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Team ID must be a positive integer',
			});
		});

		it('should return 404 when team does not exist', async () => {
			const mockService = {
				getStatsForTeam: jest
					.fn()
					.mockRejectedValue(
						new NotFoundError("Team with id 1 doesn't exist")
					),
			} as unknown as TeamStatsService;

			const controller = new TeamStatsController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getTeamStats(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: "Team with id 1 doesn't exist",
			});
		});

		it('should return 200 with team stats when team exists', async () => {
			const mockStats = {
				total: 100,
				members: [
					{
						id: 1,
						name: 'Alice',
						totalCoins: 60,
						percent: 60,
						teamId: 1,
					},
					{
						id: 2,
						name: 'Bob',
						totalCoins: 40,
						percent: 40,
						teamId: 1,
					},
				],
			};

			const mockService = {
				getStatsForTeam: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamStatsController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getTeamStats(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				total: 100,
				members: [
					{
						id: 1,
						name: 'Alice',
						totalCoins: 60,
						percent: 60,
						teamId: 1,
					},
					{
						id: 2,
						name: 'Bob',
						totalCoins: 40,
						percent: 40,
						teamId: 1,
					},
				],
			});
		});

		it('should return 200 when team exists but has no members', async () => {
			const mockStats = {
				total: 0,
				members: [],
			};

			const mockService = {
				getStatsForTeam: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamStatsController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getTeamStats(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				total: 0,
				members: [],
			});
		});
	});
});
