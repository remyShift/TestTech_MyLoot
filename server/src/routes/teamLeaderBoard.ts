import { Router } from 'express';
import { TeamLeaderBoardController } from '@/controllers/teamLeaderBoardController';
import { TeamStatsService } from '@/services/teamStatsService';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { prisma } from '@/utils/database';
import { heavyQueryLimiter } from '@/middleware/rateLimiter';

const router = Router();

const teamStatsRepository = new PrismaTeamStatsRepository(prisma);
const teamStatsService = new TeamStatsService(teamStatsRepository);
const teamLeaderBoardController = new TeamLeaderBoardController(
	teamStatsService
);

router.get('/teams/:id/leaderboard', heavyQueryLimiter, (req, res) => {
	teamLeaderBoardController.getLeaderboard(req, res);
});

export { router as teamLeaderBoardRouter };
