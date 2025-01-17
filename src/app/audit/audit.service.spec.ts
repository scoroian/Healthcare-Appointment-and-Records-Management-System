import { Container } from 'typedi';
import { AuditService } from './audit.service';
import { DatabaseService } from '../../database/database.service';
import { Request } from 'express';

jest.mock('../../database/database.service');

describe('AuditService', () => {
    let auditService: AuditService;
    let databaseService: jest.Mocked<DatabaseService>;
    let mockRequest: Partial<Request>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        auditService = new AuditService(databaseService);

        // Mock del objeto Request
        mockRequest = {
            user: {
                id: 1,
            },
        } as Partial<Request>;
    });

    it('should log an action', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        await auditService.logAction(mockRequest as Request, 'CREATE', 'User', 1);

        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO audits'),
            params: [1, 'CREATE', 'User', 1],
        });
    });

    it('should not log an action if userId is missing', async () => {
        // Elimina el user del mockRequest para simular que no hay un userId
        mockRequest = {} as Partial<Request>;

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        await auditService.logAction(mockRequest as Request, 'CREATE', 'User', 1);

        // Verifica que no se llama a execQuery
        expect(databaseService.execQuery).not.toHaveBeenCalled();

        // Verifica que se registra el error en la consola
        expect(consoleSpy).toHaveBeenCalledWith('Unable to log action: userId not found in request');

        consoleSpy.mockRestore();
    });

    it('should retrieve all logs', async () => {
        const mockLogs = [
            {
                id: 1,
                userId: 1,
                action: 'CREATE',
                resource: 'User',
                resourceId: 1,
                timestamp: '2025-01-16T10:00:00Z',
            },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockLogs });

        const result = await auditService.getAllLogs();
        expect(result).toEqual(mockLogs);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM audits ORDER BY timestamp DESC'),
        });
    });

    it('should retrieve logs by user', async () => {
        const mockLogs = [
            {
                id: 1,
                userId: 1,
                action: 'CREATE',
                resource: 'User',
                resourceId: 1,
                timestamp: '2025-01-16T10:00:00Z',
            },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockLogs });

        const result = await auditService.getLogsByUser(1);
        expect(result).toEqual(mockLogs);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM audits WHERE userId = ? ORDER BY timestamp DESC'),
            params: [1],
        });
    });
});
