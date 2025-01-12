import { Router } from 'express';
import { Container } from 'typedi';
import { SpecialtyController } from '../specialty/specialty.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const specialtyController = Container.get(SpecialtyController);
const router = Router();

// Rutas para especialidades
router.post('/', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    specialtyController.createSpecialty(req, res)
);
router.get('/', (req, res) => specialtyController.getAllSpecialties(req, res));
router.get('/:id', (req, res) => specialtyController.getSpecialtyById(req, res));
router.put('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    specialtyController.updateSpecialty(req, res)
);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    specialtyController.deleteSpecialty(req, res)
);

export default router;
