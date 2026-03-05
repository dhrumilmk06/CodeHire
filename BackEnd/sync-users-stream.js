import { prisma } from './src/lib/db.js';
import { upsertStreamUser } from './src/lib/stream.js';

async function syncAllUsersToStream() {
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users to sync.`);

        for (const user of users) {
            console.log(`Syncing user: ${user.clerkId} (${user.name})`);
            await upsertStreamUser({
                id: user.clerkId,
                name: user.name,
                image: user.profileImage
            });
        }
        console.log("✅ All users synced to Stream.");
    } catch (error) {
        console.error("❌ Error syncing users to Stream:", error);
    } finally {
        await prisma.$disconnect();
    }
}

syncAllUsersToStream();
