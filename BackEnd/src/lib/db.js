import { PrismaClient } from '@prisma/client';
import { ENV } from './env.js';

export const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Connection to PostgreSQL established via Prisma");
    } catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error);
        process.exit(1);
    }
};