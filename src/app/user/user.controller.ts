import { Service } from 'typedi';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { config } from '../../config/environment';

@Service()
export class UserController {
    private router = Router();

    constructor(private readonly userService: UserService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/register', this.register.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.get('/', this.getAllUsers.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, role } = req.body;

            const result = await this.userService.register(username, password, role);
            if (result > 0) {
                res.status(201).json({ message: 'User registered successfully' });
            } else {
                res.status(400).json({ message: 'User registration failed' });
            }
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            const isValid = await this.userService.validatePassword(username, password);

            if (isValid) {
                const token = jwt.sign({ username }, config.user_sessions.secret, {
                    expiresIn: '1h',
                });

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
}
