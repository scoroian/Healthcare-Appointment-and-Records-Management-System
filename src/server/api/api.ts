import { Router } from 'express';
import { Service } from 'typedi';
import userRoutes from '../../app/routes/user.routes';

@Service()
export class Api {
  private apiRouter: Router;

  constructor() {
    this.apiRouter = Router();

    // Registrar las rutas de usuarios
    this.apiRouter.use('/users', userRoutes);
  }

  getApiRouter(): Router {
    return this.apiRouter;
  }
}
