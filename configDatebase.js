import dotenv from 'dotenv';
dotenv.config();

const envFile=process.env.NODE_ENV == 'production'? '.env.production' : '.env.local'

export const Myconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}