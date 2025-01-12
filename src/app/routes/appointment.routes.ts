import { Router } from 'express';
import { Container } from 'typedi';
import { AppointmentController } from '../appointment/appointment.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const appointmentController = Container.get(AppointmentController);
const router = Router();

router.post('/', authenticateJWT, authorizeRoles('patient', 'admin'), (req, res) =>
    appointmentController.createAppointment(req, res)
);

router.get('/', authenticateJWT, authorizeRoles('doctor', 'patient', 'admin'), (req, res) =>
    appointmentController.getAppointments(req, res)
);

router.put('/:id', authenticateJWT, authorizeRoles('doctor', 'admin'), (req, res) =>
    appointmentController.updateAppointment(req, res)
);

router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    appointmentController.deleteAppointment(req, res)
);

export default router;
