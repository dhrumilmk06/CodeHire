import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const backupDir = './backups/mongodb_data';

async function backupData() {
    if (!process.env.DB_URL) {
        console.error("❌ DB_URL not found in .env");
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to MongoDB Atlas");

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const collections = ['users', 'sessions', 'customproblems']; // Standard lowercase plural names

        for (const colName of collections) {
            console.log(`📦 Backing up: ${colName}...`);
            const data = await mongoose.connection.db.collection(colName).find({}).toArray();
            const filePath = path.join(backupDir, `${colName}_backup.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Saved to ${filePath}`);
        }

        console.log("\n✨ All collections backed up successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Backup failed:", error);
    }
}

backupData();
