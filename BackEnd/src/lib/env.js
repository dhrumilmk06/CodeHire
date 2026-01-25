import env from 'dotenv';

env.config({quiet: true}); // Load .env file contents into process.env

export const ENV = {
    PORT: process.env.PORT, 
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV
}