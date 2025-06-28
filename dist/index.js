"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
const node_cron_1 = __importDefault(require("node-cron"));
const node_path_1 = __importDefault(require("node:path"));
const cronusNoticias_1 = require("./services/cronusNoticias");
const cronusVagas_1 = require("./services/cronusVagas");
var cors = require('cors');
data_source_1.AppDataSource.initialize().then(async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me, Authorization, type ");
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        if (req.method === 'OPTIONS') {
            return res.status(200).send({});
        }
        next();
    });
    app.use(express_1.default.static(node_path_1.default.join(__dirname, '../public')));
    app.use(cors());
    app.use(routes_1.default);
    await (0, cronusNoticias_1.cronusNoticias)();
    await (0, cronusVagas_1.cronusVagas)();
    node_cron_1.default.schedule('0 */4 * * *', async () => {
        await (0, cronusNoticias_1.cronusNoticias)();
        await (0, cronusVagas_1.cronusVagas)();
    });
    return app.listen(process.env.PORT || 3333);
}).catch(() => {
    console.log("Could not connect to the database");
});
