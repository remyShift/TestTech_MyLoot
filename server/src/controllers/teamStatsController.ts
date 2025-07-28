import { TeamStatsService } from '@/services/teamStatsService';
import { Request, Response } from 'express';
import { TeamIdValidator } from '@/utils/validators';
import { ErrorHandler } from '@/utils/errors';

export class TeamStatsController {
	constructor(private readonly teamStatsService: TeamStatsService) {}

	async getTeamStats(req: Request, res: Response) {
		const { id } = req.params;

		return TeamIdValidator.validate(id)
			.then(async (teamId) => {
				return this.teamStatsService
					.getStatsForTeam(teamId)
					.then((teamStats) => {
						res.status(200).json({
							total: teamStats.total,
							members: teamStats.members,
						});
					});
			})
			.catch((error) => {
				ErrorHandler.handleControllerError(error, res);
			});
	}
}
