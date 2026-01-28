import { StreamChat} from 'stream-chat';
import { ENV } from './env.js';

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

//passing api key or secret to know we are sending to stream server
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

//this is for viewing stream user in console
export const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// this function work is to send userdata from clerk to stream
//userData is coming from clerak and upsert means update + create upsertUser is stream built in methos to create user
export const upsertStreamUser  = async (userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted successfully:", userData)
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};

export const deleteStreamUser  = async (userId) => {
    try {
        await chatClient.deleteUser(userId)
        console.log("Stram user deleted  successfully:", userId)
    } catch (error) {
        console.error("Error deleting Stream user:", error);
    }
};

//this is for viewing stream user in console
export const users = await serverClient.queryUsers({});
console.log(users);