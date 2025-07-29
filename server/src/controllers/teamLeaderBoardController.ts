import { TeamStatsService } from '@/services/teamStatsService';
import { Request, Response } from 'express';
import {
	TeamIdValidator,
	DateValidator,
	PaginationValidator,
} from '@/utils/validators';
import { ErrorHandler } from '@/utils/errors';

export class TeamLeaderBoardController {
	constructor(private readonly teamStatsService: TeamStatsService) {}

	async getLeaderboard(req: Request, res: Response) {
		const { id } = req.params;
		const { from, to, page, limit } =
			(req.query as {
				from?: string;
				to?: string;
				page?: string;
				limit?: string;
			}) || {};

		return TeamIdValidator.validate(id)
			.then(async (teamId) => {
				return Promise.all([
					DateValidator.validateOptionalDates(from, to),
					PaginationValidator.validatePagination(page, limit),
				]).then(async ([dates, pagination]) => {
					const teamStats =
						await this.teamStatsService.getTeamLeaderBoard(
							teamId,
							dates.from,
							dates.to,
							pagination.page,
							pagination.limit
						);

					res.status(200).json(teamStats);
				});
			})
			.catch((error) => ErrorHandler.handleControllerError(error, res));
	}
}
