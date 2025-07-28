import express from 'express';
import cors from 'cors';
import { teamStatsRouter } from '@/routes/teamLeaderBoard';

export function createApp() {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/', teamStatsRouter);

	return app;
}
