import { config } from 'dotenv';
import { PrismaClient } from '../../prisma/generated/prisma';
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
