import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

config({ path: path.join(__dirname, '.env.test') });

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined in .env.test');
}

export const testPrisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL,
		},
	},
});

export async function cleanDatabase() {
	await testPrisma.$executeRaw`TRUNCATE TABLE "Team", "User", "CoinEarning" RESTART IDENTITY CASCADE`;

	await new Promise((resolve) => setTimeout(resolve, 50));
}

export async function disconnectTestPrisma() {
	await testPrisma.$disconnect();
}
