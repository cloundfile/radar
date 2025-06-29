import express, { Application } from 'express';
import { AppDataSource } from './data-source';
import routes from './routes';

import cron from 'node-cron';
import path from 'node:path';
import { cronusNoticias } from './services/cronusNoticias';
import { cronusVagas } from './services/cronusVagas';
var cors = require('cors');

AppDataSource.initialize().then(async () => {
  const app: Application = express();
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS")
    res.setHeader("Access-Control-Max-Age", "3600")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me, Authorization, type ")
    res.setHeader("Access-Control-Expose-Headers","Authorization")    
    if (req.method === 'OPTIONS') {
      return res.status(200).send({});
    }
    next();
  });

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(cors())
  app.use(routes); 

  await cronusNoticias();
  await cronusVagas();
  cron.schedule('0 */4 * * *', async () => {
    await cronusNoticias();
    await cronusVagas();
  });

  const port = process.env.PORT || 3333;
  return app.listen(port, () => {
    console.log(`Server on in port: ${port}`);
  });
}).catch(() => {
  console.log("database not connected.");
});