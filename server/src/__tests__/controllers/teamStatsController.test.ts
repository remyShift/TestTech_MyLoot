import { describe, it, expect } from '@jest/globals';
import { Request, Response } from 'express';
import { TeamStatsController } from '@/controllers/teamStatsController';
import { TeamStatsService } from '@/services/teamStatsService';

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
						new Error("Error: Team with id 1 doesn't exist")
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
				error: "Error: Team with id 1 doesn't exist",
			});
		});
	});
});
