import express from 'express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
const app = express();


app.get('/', (req,res) => {
    res.send("Hello World")
})


//this function is for first connecting to the database and then starting the server
const startServer = async () => {
    try {
        await connectDB()
        app.listen(ENV.PORT, () => {
        console.log("Server is running on port:" , ENV.PORT)
        });
    } catch (error) {
        console.error("❌Error starting server:", error)
    }
}

startServer();
