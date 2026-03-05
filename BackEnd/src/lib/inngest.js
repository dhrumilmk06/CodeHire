import { Inngest } from 'inngest'
import { prisma } from './db.js'
import { deleteStreamUser, upsertStreamUser } from './stream.js'
import { getFileExecution } from './utils.js'
import { emitToUser, emitToRoom } from './socket.js'
import { runAutoScore } from './scoring.js'

export const inngest = new Inngest({
    id: 'codehire-app'
})

//syncUser function is used to connect clerk to PostgreSQL for to store user account
export const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        const { id, email_addresses, first_name, last_name, image_url } = event.data

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""} `.trim(),
            profileImage: image_url,
        };

        // Using upsert in case the user was already created (e.g., via a manual sync or re-run)
        const user = await prisma.user.upsert({
            where: { clerkId: id },
            update: {
                email: newUser.email,
                name: newUser.name,
                profileImage: newUser.profileImage
            },
            create: newUser
        });

        await upsertStreamUser({
            id: user.clerkId,
            name: user.name,
            image: user.profileImage
        })
    }
)

export const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user" },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        const { id } = event.data

        await prisma.user.delete({
            where: { clerkId: id }
        });

        await deleteStreamUser(id.toString());
    }
)

export const autoScore = inngest.createFunction(
    { id: "auto-score", retries: 2 },
    { event: 'app/code.run' },

    async ({ event }) => {
        await runAutoScore(event.data);
        return { success: true };
    }
);

export const functions = [syncUser, deleteUserFromDB, autoScore];
