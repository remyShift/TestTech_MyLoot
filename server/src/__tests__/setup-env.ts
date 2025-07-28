import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

export const testPrisma = new PrismaClient();

config({ path: '.env.test' });

console.log(testPrisma.$connect());
console.log(process.env.DATABASE_URL);
