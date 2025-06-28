"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "oracle",
    connectString: process.env.DATABASE_HOSTNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [`${__dirname}/**/domain/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
});
