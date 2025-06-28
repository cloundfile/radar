import { HomeController } from '../aplication/HomePage';
import { Router } from 'express';
const routes = Router();

const homepage = new HomeController();

routes.get('/',   homepage.welcome);
export default routes