import env from 'dotenv';

env.config();

export const ENV = {
    PORT: process.env.PORT 
}