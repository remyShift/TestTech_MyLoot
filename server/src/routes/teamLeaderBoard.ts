import { Router } from 'express';
import { TeamLeaderBoardController } from '@/controllers/teamLeaderBoardController';
import { TeamStatsService } from '@/services/teamStatsService';
import { PrismaTeamStatsRepository } from '@/repositories/teamStatsRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.get('/teams/:id/stats', (req, res) => {
	const service = new TeamStatsService(
		new PrismaTeamStatsRepository(new PrismaClient())
	);
	const controller = new TeamLeaderBoardController(service);
	controller.getTeamStats(req, res);
});

export { router as teamStatsRouter };
