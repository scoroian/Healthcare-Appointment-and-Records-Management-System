import { Router } from 'express';
import { Service } from 'typedi';
import userRoutes from '../../app/routes/user.routes';
import appointmentRoutes from '../../app/routes/appointment.routes';

@Service()
export class Api {
  private apiRouter: Router;

  constructor() {
    this.apiRouter = Router();

    // Registrar las rutas de usuarios
    this.apiRouter.use('/users', userRoutes);
    // Registrar las rutas de citas
    this.apiRouter.use('/appointments', appointmentRoutes);
  }

  getApiRouter(): Router {
    return this.apiRouter;
  }
}
