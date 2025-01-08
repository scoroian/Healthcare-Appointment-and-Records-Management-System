import { Router } from 'express';
import { Service } from 'typedi';
import { authenticateJWT } from '../../app/middleware/middleware.service';

@Service()
export class Api {
  private apiRouter: Router;

  constructor(
  ) {
    this.apiRouter = Router();


  }

  getApiRouter(): Router {
    return this.apiRouter;
  }
}
