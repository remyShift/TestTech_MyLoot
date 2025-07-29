import { CoinEarningsRepository } from '@/repositories/coinEarningsRepository';
import { CoinEarning } from '@/types/models';

export class CoinEarningsService {
	constructor(
		private readonly coinEarningsRepository: CoinEarningsRepository
	) {}

	async createCoinEarning(
		userId: number,
		amount: number
	): Promise<CoinEarning> {
		return await this.coinEarningsRepository.createCoinEarning(
			userId,
			amount
		);
	}
}
