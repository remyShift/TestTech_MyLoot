import { Router } from 'express';
import { CoinEarningsController } from '@/controllers/coinEarningsController';
import { CoinEarningsService } from '@/services/coinEarningsService';
import { PrismaCoinEarningsRepository } from '@/repositories/coinEarningsRepository';
import { prisma } from '@/utils/database';
import { strictLimiter } from '@/middleware/rateLimiter';

const router = Router();

const coinEarningsRepository = new PrismaCoinEarningsRepository(prisma);
const coinEarningsService = new CoinEarningsService(coinEarningsRepository);
const coinEarningsController = new CoinEarningsController(coinEarningsService);

router.post('/coin_earnings', strictLimiter, (req, res) => {
	coinEarningsController.createCoinEarning(req, res);
});

export { router as coinEarningsRouter };
