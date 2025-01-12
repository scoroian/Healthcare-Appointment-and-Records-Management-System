import { Router } from 'express';
import { Service } from 'typedi';
import userRoutes from '../../app/routes/user.routes';
import appointmentRoutes from '../../app/routes/appointment.routes';
import medicalRecordRoutes from '../../app/routes/medical-record.routes';
import specialtyRoutes from "../../app/routes/specialty.routes";

@Service()
export class Api {
  private apiRouter: Router;

  constructor() {
    this.apiRouter = Router();

    // Registrar las rutas de usuarios
    this.apiRouter.use('/users', userRoutes);
    // Registrar las rutas de citas
    this.apiRouter.use('/appointments', appointmentRoutes);
    // Registrar las rutas de registros medicos
    this.apiRouter.use('/medical-records', medicalRecordRoutes);
    // Registrar las rutas de especialidades
    this.apiRouter.use('/specialties', specialtyRoutes);
  }

  getApiRouter(): Router {
    return this.apiRouter;
  }
}
