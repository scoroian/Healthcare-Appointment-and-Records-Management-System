import { Router } from 'express';
import { Container } from 'typedi';
import { AuditController } from '../audit/audit.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const auditController = Container.get(AuditController);
const router = Router();

// Rutas de auditoría
router.get('/', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    auditController.getAllLogs(req, res)
);
router.get('/user/:userId', authenticateJWT, authorizeRoles('admin'), (req, res) =>
    auditController.getLogsByUser(req, res)
);

export default router;
