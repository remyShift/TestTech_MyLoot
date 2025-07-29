import { Router } from 'express';
import { CoinEarningsController } from '@/controllers/coinEarningsController';
import { CoinEarningsService } from '@/services/coinEarningsService';
import { PrismaCoinEarningsRepository } from '@/repositories/coinEarningsRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.post('/coin_earnings', (req, res) => {
	const repository = new PrismaCoinEarningsRepository(new PrismaClient());
	const service = new CoinEarningsService(repository);
	const controller = new CoinEarningsController(service);
	controller.createCoinEarning(req, res);
});

export { router as coinEarningsRouter };