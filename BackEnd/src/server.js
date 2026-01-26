import express from 'express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import { serve } from 'inngest/express';
import { functions, inngest } from './lib/inngest.js';
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


app.get('/api/health', (req, res) => {
    res.send("Hello World")
})

//middlewares
app.use(express.json());
/* Cors means It is a security mechanism used by browsers to control:“Which frontend is allowed to talk to which backend?”
credentials: true means server allows browser to include cookies on requests
*/
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))

app.use("/api/inngest", serve({
    client: inngest,
    functions,
    signingKey: ENV.INNGEST_SIGNING_KEY,
}))

//deployment code
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../FrontEnd/dist")));

    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../FrontEnd", "dist", "index.html"));
    });
}
//this function is for first connecting to the database and then starting the server
const startServer = async () => {
    try {
        await connectDB()
        app.listen(ENV.PORT, () => {
            console.log("Server is running on port:", ENV.PORT)
        });
    } catch (error) {
        console.error("❌Error starting server:", error)
    }
}

startServer();
