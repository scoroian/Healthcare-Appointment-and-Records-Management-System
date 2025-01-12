import { Router } from 'express';
import { Container } from 'typedi';
import { DepartmentController } from '../department/department.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const departmentController = Container.get(DepartmentController);
const router = Router();

// Rutas para departamentos
router.post('/', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    departmentController.createDepartment(req, res)
);
router.get('/', (req, res) => departmentController.getAllDepartments(req, res));
router.get('/:id', (req, res) => departmentController.getDepartmentById(req, res));
router.put('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    departmentController.updateDepartment(req, res)
);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    departmentController.deleteDepartment(req, res)
);

export default router;
