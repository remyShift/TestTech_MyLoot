import { PrismaClient } from '@prisma/client';
import { UserWithStats } from '@/types/domain';
import { CoinEarning, Team, User } from '@/types/models';
import { NotFoundError } from '@/utils/errors';

export interface TeamStatsRepository {
	getTeamMembers(teamId: number): Promise<UserWithStats[]>;
	getTeamMembersWithDateFilter(
		teamId: number,
		startDate: Date,
		endDate: Date,
		page?: number,
		limit?: number
	): Promise<UserWithStats[]>;
	getTeamMembersCount(teamId: number): Promise<number>;
	getTeamMembersCountWithDateFilter(
		teamId: number,
		startDate: Date,
		endDate: Date
	): Promise<number>;
}

export class PrismaTeamStatsRepository implements TeamStatsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getTeamMembers(teamId: number): Promise<UserWithStats[]> {
		const users = await this.getUsers(teamId);

		return users.map((user: User) => {
			const { coinEarnings, ...userWithoutEarnings } = user;

			return {
				...userWithoutEarnings,
				totalCoins: coinEarnings.reduce(
					(sum: number, earning: CoinEarning) => sum + earning.amount,
					0
				),
			} as UserWithStats;
		});
	}

	async getTeamMembersWithDateFilter(
		teamId: number,
		startDate: Date,
		endDate: Date,
		page?: number,
		limit?: number
	): Promise<UserWithStats[]> {
		const users = await this.getUsersWithEarningsInDateRange(
			teamId,
			startDate,
			endDate,
			page,
			limit
		);

		if (!users) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return users.map((user: User) => {
			const { coinEarnings, ...userWithoutEarnings } = user;

			return {
				...userWithoutEarnings,
				totalCoins: coinEarnings.reduce(
					(sum: number, earning: CoinEarning) => sum + earning.amount,
					0
				),
			} as UserWithStats;
		});
	}

	private async getUsersWithEarningsInDateRange(
		teamId: number,
		startDate: Date,
		endDate: Date,
		page?: number,
		limit?: number
	): Promise<User[]> {
		let result: Team | undefined;
		if (page && limit) {
			result = (await this.prisma.team.findUnique({
				where: { id: teamId },
				include: {
					users: {
						skip: (page - 1) * limit,
						take: limit,
						include: {
							coinEarnings: {
								where: {
									date: {
										gte: startDate,
										lte: endDate,
									},
								},
							},
						},
					},
				},
			})) as Team;
		} else {
			result = (await this.prisma.team.findUnique({
				where: { id: teamId },
				include: {
					users: {
						include: {
							coinEarnings: {
								where: {
									date: {
										gte: startDate,
										lte: endDate,
									},
								},
							},
						},
					},
				},
			})) as Team;
		}

		if (!result) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return result.users;
	}

	private async getUsers(teamId: number): Promise<User[]> {
		const result = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: {
				users: {
					include: {
						coinEarnings: true,
					},
				},
			},
		});

		if (!result) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return result.users;
	}

	async getTeamMembersCount(teamId: number): Promise<number> {
		const result = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: {
				users: true,
			},
		});

		if (!result) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return result.users.length;
	}

	async getTeamMembersCountWithDateFilter(
		teamId: number,
		startDate: Date,
		endDate: Date
	): Promise<number> {
		const result = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: {
				users: {
					include: {
						coinEarnings: {
							where: {
								date: {
									gte: startDate,
									lte: endDate,
								},
							},
						},
					},
				},
			},
		});

		if (!result) {
			throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
		}

		return result.users.length;
	}
}
