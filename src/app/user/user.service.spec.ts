import { Container } from 'typedi';
import { UserService } from './user.service';
import { DatabaseService } from '../../database/database.service';
import { User } from './user.model';

jest.mock('../../database/database.service');

describe('UserService', () => {
    let userService: UserService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        userService = new UserService(databaseService);
    });

    it('should register a new user', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await userService.register('johnDoe', 'password123', 'admin', 'john@example.com');
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO users'),
            params: ['johnDoe', 'password123', 'admin', 'john@example.com'],
        });
    });

    it('should retrieve a user by username', async () => {
        const mockUser = {
            id: 1,
            username: 'johnDoe',
            password: 'password123',
            role: 'admin',
            email: 'john@example.com',
            createdAt: '2025-01-16T10:00:00Z',
        };

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockUser] });

        const result = await userService.getUserByUsername('johnDoe');
        expect(result).toEqual(mockUser);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM users WHERE username = ?'),
            params: ['johnDoe'],
        });
    });

    it('should validate a user password', async () => {
        const mockUser = {
            id: 1,
            username: 'johnDoe',
            password: 'password123',
            role: 'admin',
            email: 'john@example.com',
            createdAt: '2025-01-16T10:00:00Z',
        };

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockUser] });

        const result = await userService.validatePassword('johnDoe', 'password123');
        expect(result).toBe(true);
    });

    it('should return false for invalid user password', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 0, rows: [] });

        const result = await userService.validatePassword('johnDoe', 'wrongPassword');
        expect(result).toBe(false);
    });

    it('should retrieve all users', async () => {
        const mockUsers = [
            {
                id: 1,
                username: 'johnDoe',
                role: 'admin',
                email: 'john@example.com',
                createdAt: '2025-01-16T10:00:00Z',
            },
            {
                id: 2,
                username: 'janeDoe',
                role: 'user',
                email: 'jane@example.com',
                createdAt: '2025-01-16T11:00:00Z',
            },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 2, rows: mockUsers });

        const result = await userService.getAllUsers();
        expect(result).toEqual(mockUsers);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT id, username, role, email, createdAt FROM users'),
        });
    });

    it('should update a user', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const updates = { email: 'newemail@example.com' };
        const result = await userService.updateUser('johnDoe', updates);

        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('UPDATE users SET'),
            params: [...Object.values(updates), 'johnDoe'],
        });
    });

    it('should delete a user', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await userService.deleteUser('johnDoe');
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('DELETE FROM users WHERE username = ?'),
            params: ['johnDoe'],
        });
    });
});
