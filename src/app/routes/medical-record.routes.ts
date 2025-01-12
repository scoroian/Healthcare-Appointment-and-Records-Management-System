import { Router } from 'express';
import { Container } from 'typedi';
import { MedicalRecordController } from '../MedicalRecord/medical-record.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const medicalRecordController = Container.get(MedicalRecordController);
const router = Router();

router.post('/', authenticateJWT, authorizeRoles('doctor', 'admin'), (req, res) =>
    medicalRecordController.createMedicalRecord(req, res)
);

router.get('/', authenticateJWT, authorizeRoles('patient', 'admin'), (req, res) =>
    medicalRecordController.getMedicalRecords(req, res)
);

router.put('/:id', authenticateJWT, authorizeRoles('doctor', 'admin'), (req, res) =>
    medicalRecordController.updateMedicalRecord(req, res)
);

router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    medicalRecordController.deleteMedicalRecord(req, res)
);

export default router;
