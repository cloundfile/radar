import { Request, Response } from 'express';
import path from 'path';

export class HomeController {
  welcome(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  }
}