import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(process.cwd(), 'backups', 'postgresql_backup');

async function backup() {
    try {
        console.log("🚀 Starting PostgreSQL data backup...");

        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const runDir = path.join(BACKUP_DIR, `backup-${timestamp}`);
        fs.mkdirSync(runDir);

        // List of models to backup
        const models = ['User', 'CustomProblem', 'Session'];

        for (const modelName of models) {
            console.log(`📦 Exporting ${modelName}...`);
            // Use dynamic accessor for prisma model
            const data = await prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)].findMany();
            
            const filePath = path.join(runDir, `${modelName.toLowerCase()}s_backup.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Saved ${data.length} records to ${filePath}`);
        }

        console.log("\n✨ Backup completed successfully!");
        console.log(`📂 Location: ${runDir}`);

    } catch (error) {
        console.error("❌ Backup failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backup();
