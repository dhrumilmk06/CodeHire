import env from 'dotenv';

env.config({ quiet: true }); // Load .env file contents into process.env

const rawFrontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
const cleanedFrontendUrl = rawFrontendUrl ? rawFrontendUrl.trim().replace(/\/+$/, '') : 'http://localhost:5173';

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,
    CLIENT_URL: cleanedFrontendUrl,
    FRONTEND_URL: cleanedFrontendUrl,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PISTON_URL: process.env.PISTON_URL || 'http://localhost:2000',
}
