import { Service } from 'typedi';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { config } from '../../config/environment';
import {logAuditAction} from "../middleware/middleware.audit";

@Service()
export class UserController {
    constructor(private readonly userService: UserService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, role, email } = req.body;

            const result = await this.userService.register(username, password, role, email);
            res.status(201).json({ message: 'User registered successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            const user = await this.userService.getUserByUsername(username);
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValid = await this.userService.validatePassword(username, password);

            if (isValid) {
                // Incluye el rol en el token JWT
                const token = jwt.sign(
                    { username: user?.username, role: user?.role, id:user?.id }, // Agregamos `role`
                    config.user_sessions.secret,
                    { expiresIn: '1h' }
                );

                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getUserByUsername(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.params;

            const user = await this.userService.getUserByUsername(username);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.params;
            const updates = req.body;

            const user = await this.userService.getUserByUsername(username);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }

            const result = await this.userService.updateUser(username, updates);

            // Registrar auditoría
            await logAuditAction(req, 'UPDATE', 'User', user?.id);

            res.status(200).json({ message: 'User updated successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.params;

            // Buscar al usuario que se desea eliminar
            const user = await this.userService.getUserByUsername(username);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }

            // Eliminar al usuario
            await this.userService.deleteUser(username);

            // Registrar auditoría
            await logAuditAction(req, 'DELETE', 'User', user?.id);

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

}
