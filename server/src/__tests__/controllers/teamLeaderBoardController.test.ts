import { describe, it, expect } from '@jest/globals';
import { Request, Response } from 'express';
import { TeamLeaderBoardController } from '@/controllers/teamLeaderBoardController';
import { TeamStatsService } from '@/services/teamStatsService';
import { NotFoundError } from '@/utils/errors';

describe('TeamLeaderBoardController', () => {
	describe('getLeaderboard', () => {
		it('should return 400 when teamId is not a valid number', async () => {
			const mockService = {
				getTeamLeaderBoard: jest.fn(),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: 'toto' },
				query: {},
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Team ID must be a positive integer',
				status: 400,
			});
		});

		it('should return 404 when team does not exist', async () => {
			const mockService = {
				getTeamLeaderBoard: jest
					.fn()
					.mockRejectedValue(
						new NotFoundError("Team with id 1 doesn't exist")
					),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: {},
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: "Team with id 1 doesn't exist",
				status: 404,
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
				getTeamLeaderBoard: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: {},
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

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
				getTeamLeaderBoard: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: {},
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				total: 0,
				members: [],
			});
		});
	});

	describe('getLeaderboard with date filters', () => {
		it('should return 400 when from date parameter is invalid', async () => {
			const mockService = {
				getTeamLeaderBoard: jest.fn(),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: { from: 'invalid-date', to: '2024-01-31' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Invalid date format for from parameter',
				status: 400,
			});
		});

		it('should return 400 when to date parameter is invalid', async () => {
			const mockService = {
				getTeamLeaderBoard: jest.fn(),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: { from: '2024-01-01', to: 'invalid-date' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Invalid date format for to parameter',
				status: 400,
			});
		});

		it('should return 200 with filtered data when both dates are provided', async () => {
			const mockStats = {
				total: 50,
				members: [
					{
						id: 1,
						name: 'Alice',
						totalCoins: 30,
						percent: 60,
						teamId: 1,
					},
					{
						id: 2,
						name: 'Bob',
						totalCoins: 20,
						percent: 40,
						teamId: 1,
					},
				],
			};

			const mockService = {
				getTeamLeaderBoard: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: { from: '2024-01-01', to: '2024-01-31' },
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(mockService.getTeamLeaderBoard).toHaveBeenCalledWith(
				1,
				new Date('2024-01-01'),
				new Date('2024-01-31'),
				undefined,
				undefined
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockStats);
		});

		it('should use non-filtered version when no date parameters provided', async () => {
			const mockStats = {
				total: 100,
				members: [],
			};

			const mockService = {
				getTeamLeaderBoard: jest.fn().mockResolvedValue(mockStats),
			} as unknown as TeamStatsService;

			const controller = new TeamLeaderBoardController(mockService);

			const req = Object.assign({} as Request, {
				params: { id: '1' },
				query: {},
			});
			const res = Object.assign({} as Response, {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			});

			await controller.getLeaderboard(req, res);

			expect(mockService.getTeamLeaderBoard).toHaveBeenCalledWith(
				1,
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockStats);
		});
	});
});
