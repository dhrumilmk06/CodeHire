import { Inngest } from 'inngest'
import { connectDB } from './db.js'
import User from '../models/User.js'
import { ENV } from './env.js'

export const inngest = new Inngest({
    id: 'codehire-app',
    eventKey: ENV.INNGEST_EVENT_KEY,
})

//syncUser function is used to connect clerk to mongo db for to store  user account and listens to user.created event from Clerk and creates a new user in our database
const syncUser = inngest.createFunction(
    { id: "sync-user" }, // we can give any id here
    { event: 'clerk/user.created' }, // this is event in clerk that we are listening means whnever a new user is created in clerk this function will be triggered

    async ({ event }) => { // this is the function that will be executed when the event is triggered
        await connectDB()
        //this event id,email_addresses, first_name, last_name, image_url are give by cleark when user is created
        const { id, email_addresses, first_name, last_name, image_url } = event.data

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""} `,
            profileImage: image_url,
        };

        await User.create(newUser);
    }
)

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user" }, // we can give any id here
    { event: 'clerk/user.deleted' },

    async ({ event }) => { // this is the function that will be executed when the event is triggered
        await connectDB()
        //this event id is given by cleark when user is deleted
        const { id } = event.data

        await User.deleteOne({ clerkId: id });
    }
)

export const functions = [syncUser, deleteUserFromDB];