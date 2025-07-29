import { TeamStatsService } from '@/services/teamStatsService';
import { Request, Response } from 'express';
import { TeamIdValidator, DateValidator } from '@/utils/validators';
import { ErrorHandler } from '@/utils/errors';

export class TeamLeaderBoardController {
	constructor(private readonly teamStatsService: TeamStatsService) {}

	async getLeaderboard(req: Request, res: Response) {
		const { id } = req.params;
		const { from, to } =
			(req.query as { from?: string; to?: string }) || {};

		return TeamIdValidator.validate(id)
			.then(async (teamId) => {
				return DateValidator.validateOptionalDates(from, to).then(
					async (dates) => {
						const teamStats =
							await this.teamStatsService.getTeamLeaderBoard(
								teamId,
								dates.from,
								dates.to
							);

						res.status(200).json(teamStats);
					}
				);
			})
			.catch((error) => ErrorHandler.handleControllerError(error, res));
	}
}
