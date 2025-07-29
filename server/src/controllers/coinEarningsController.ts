import { CoinEarningsService } from '@/services/coinEarningsService';
import { Request, Response } from 'express';
import { UserIdValidator, AmountValidator } from '@/utils/validators';
import { ErrorHandler } from '@/utils/errors';

export class CoinEarningsController {
	constructor(private readonly coinEarningsService: CoinEarningsService) {}

	async createCoinEarning(req: Request, res: Response) {
		const { userId, amount } = req.body;

		return UserIdValidator.validate(userId)
			.then(async (validUserId) => {
				return AmountValidator.validate(amount).then(
					async (validAmount) => {
						const coinEarning =
							await this.coinEarningsService.createCoinEarning(
								validUserId,
								validAmount
							);

						res.status(201).json(coinEarning);
					}
				);
			})
			.catch((error) => ErrorHandler.handleControllerError(error, res));
	}
}
