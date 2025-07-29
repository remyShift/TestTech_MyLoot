import { PrismaClient } from '@prisma/client';
import { CoinEarning } from '@/types/models';
import { NotFoundError } from '@/utils/errors';

export interface CoinEarningsRepository {
	createCoinEarning(userId: number, amount: number): Promise<CoinEarning>;
}

export class PrismaCoinEarningsRepository implements CoinEarningsRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async createCoinEarning(
		userId: number,
		amount: number
	): Promise<CoinEarning> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundError(`User with id ${userId} does not exist`);
		}

		const coinEarning = await this.prisma.coinEarning.create({
			data: {
				userId,
				amount,
				date: new Date(),
			},
		});

		return coinEarning;
	}
}
