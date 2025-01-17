import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/environment';
import { logAuditAction } from '../middleware/middleware.audit';
import {User} from "./user.model";

jest.mock('./user.service');
jest.mock('../middleware/middleware.audit');
jest.mock('jsonwebtoken');

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: jest.Mocked<UserService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockUserService = new UserService({} as any) as jest.Mocked<UserService>;
        userController = new UserController(mockUserService);

        mockJson = jest.fn();
        mockRequest = {} as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should register a user', async () => {
        mockUserService.register.mockResolvedValue(1);
        mockRequest.body = { username: 'testuser', password: 'password', role: 'admin', email: 'test@example.com' };

        await userController.register(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.register).toHaveBeenCalledWith('testuser', 'password', 'admin', 'test@example.com');
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should login a user with valid credentials', async () => {
        mockUserService.getUserByUsername.mockResolvedValue({ id: 1, username: 'testuser', role: 'admin', password: 'password' });
        mockUserService.validatePassword.mockResolvedValue(true);
        mockRequest.body = { username: 'testuser', password: 'password' };

        const mockToken = 'mock-token';
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        await userController.login(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.getUserByUsername).toHaveBeenCalledWith('testuser');
        expect(mockUserService.validatePassword).toHaveBeenCalledWith('testuser', 'password');
        expect(jwt.sign).toHaveBeenCalledWith(
            { username: 'testuser', role: 'admin', id: 1 },
            config.user_sessions.secret,
            { expiresIn: '1h' }
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ token: mockToken });
    });

    it('should not login a user with invalid credentials', async () => {
        mockUserService.getUserByUsername.mockResolvedValue(null);
        mockRequest.body = { username: 'testuser', password: 'password' };

        await userController.login(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.getUserByUsername).toHaveBeenCalledWith('testuser');
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should retrieve all users', async () => {
        const mockUsers = [
            { id: 1, username: 'user1', role: 'admin', email: 'user1@example.com', password: "1234" }
        ];

        mockUserService.getAllUsers.mockResolvedValue(mockUsers as User[]);

        await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.getAllUsers).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockUsers);
    });

    it('should retrieve a user by username', async () => {
        const mockUser = { id: 1, username: 'user1', role: 'admin' as 'admin', email: 'user1@example.com', password: "1234"  };

        mockUserService.getUserByUsername.mockResolvedValue(mockUser);
        mockRequest.params = { username: 'user1' };

        await userController.getUserByUsername(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.getUserByUsername).toHaveBeenCalledWith('user1');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should update a user', async () => {
        const mockUser = { id: 1, username: 'user1', role: 'admin' as 'admin', email: 'user1@example.com', password: "1234"  };

        mockUserService.getUserByUsername.mockResolvedValue(mockUser);
        mockRequest.params = { username: 'user1' };
        mockRequest.body = { role: 'user' };

        await userController.updateUser(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.updateUser).toHaveBeenCalledWith('user1', { role: 'user' });
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'UPDATE', 'User', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'User updated successfully' });
    });

    it('should delete a user', async () => {
        const mockUser = { id: 1, username: 'user1', role: 'admin' as 'admin', email: 'user1@example.com', password: "1234"  };

        mockUserService.getUserByUsername.mockResolvedValue(mockUser);
        mockRequest.params = { username: 'user1' };

        await userController.deleteUser(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.deleteUser).toHaveBeenCalledWith('user1');
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'DELETE', 'User', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 when deleting a non-existent user', async () => {
        mockUserService.getUserByUsername.mockResolvedValue(null);
        mockRequest.params = { username: 'user1' };

        await userController.deleteUser(mockRequest as Request, mockResponse as Response);

        expect(mockUserService.getUserByUsername).toHaveBeenCalledWith('user1');
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'User not found' });
    });
});
