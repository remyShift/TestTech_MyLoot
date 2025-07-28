import { TeamStatsService } from '@/services/teamStatsService';
import { Request, Response } from 'express';

export class TeamStatsController {
	constructor(private readonly teamStatsService: TeamStatsService) {}

	async getTeamStats(req: Request, res: Response) {
		const { id } = req.params;
		return this.validateTeamId(id)
			.then(async (teamId) => {
				return this.teamStatsService
					.getStatsForTeam(teamId)
					.then((teamStats) => {
						res.status(200).json({
							total: teamStats.total,
							members: teamStats.members,
						});
					})
					.catch((error) => {
						res.status(404).json({
							error: error.message,
						});
					});
			})
			.catch((error) => {
				res.status(400).json({
					error: error.message,
				});
			});
	}

	private validateTeamId(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const teamId = parseInt(id);
			if (Number.isNaN(teamId) || teamId <= 0) {
				reject(new Error('Team ID must be a positive integer'));
			} else {
				resolve(teamId);
			}
		});
	}
}
