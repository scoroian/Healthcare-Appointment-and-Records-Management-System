import { Router } from 'express';
import { Container } from 'typedi';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';
import {DoctorAssociationController} from "../doctorAssociation/doctor-association.controller";

const doctorAssociationController = Container.get(DoctorAssociationController);
const router = Router();

// Rutas para asignar especialidades y departamentos
router.post('/specialty', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    doctorAssociationController.assignSpecialty(req, res)
);

router.post('/department', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    doctorAssociationController.assignDepartment(req, res)
);

router.get('/:doctorId/specialties', authenticateJWT, (req, res) =>
    doctorAssociationController.getDoctorSpecialties(req, res)
);

router.get('/:doctorId/departments', authenticateJWT, (req, res) =>
    doctorAssociationController.getDoctorDepartments(req, res)
);

router.get('/specialty/:specialtyId/doctors', authenticateJWT, (req, res) =>
    doctorAssociationController.getDoctorsBySpecialty(req, res)
);

router.get('/department/:departmentId/doctors', authenticateJWT, (req, res) =>
    doctorAssociationController.getDoctorsByDepartment(req, res)
);

export default router;
