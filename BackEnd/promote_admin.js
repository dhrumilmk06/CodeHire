import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/express';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.error("Please provide an email: node promote_admin.js your-email@example.com");
    process.exit(1);
}

async function main() {
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
    });
    
    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
            role: 'admin'
        }
    });

    console.log(`✅ Successfully promoted ${user.email} to ADMIN in both DB and Clerk.`);
}

main().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
