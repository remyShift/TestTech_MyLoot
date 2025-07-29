import { CoinEarning } from '@/types/models';
import { CoinEarningsRepository } from '@/repositories/coinEarningsRepository';

export class CoinEarningsService {
	constructor(private readonly coinEarningsRepository: CoinEarningsRepository) {}

	async createCoinEarning(
		userId: number,
		amount: number
	): Promise<CoinEarning> {
		return this.coinEarningsRepository.createCoinEarning(userId, amount);
	}
}
