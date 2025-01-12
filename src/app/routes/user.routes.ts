import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../user/user.controller';
import { authenticateJWT } from '../middleware/middleware.service';
import { authorizeRoles } from '../middleware/middleware.roles.service';

const userController = Container.get(UserController);

const router = Router();

// Rutas abiertas
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

// Rutas protegidas
router.get('/', authenticateJWT, authorizeRoles('admin'), (req, res) => userController.getAllUsers(req, res));
router.get('/:username', authenticateJWT, authorizeRoles('admin', 'doctor'), (req, res) => userController.getUserByUsername(req, res));
router.put('/:username', authenticateJWT, authorizeRoles('admin'), (req, res) => userController.updateUser(req, res));
router.delete('/:username', authenticateJWT, authorizeRoles('admin'), (req, res) => userController.deleteUser(req, res));

export default router;