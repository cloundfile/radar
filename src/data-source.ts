import { DataSource } from "typeorm";
import 'reflect-metadata';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "oracle",
    connectString: process.env.DATABASE_HOSTNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities:   [`${__dirname}/**/domain/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
});