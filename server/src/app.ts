import express from 'express';
import cors from 'cors';
import { teamLeaderBoardRouter } from '@/routes/teamLeaderBoard';
import { coinEarningsRouter } from '@/routes/coinEarnings';

export function createApp() {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/', teamLeaderBoardRouter);
	app.use('/', coinEarningsRouter);

	return app;
}
