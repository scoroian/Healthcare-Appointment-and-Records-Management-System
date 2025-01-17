import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { Request, Response } from 'express';

jest.mock('./audit.service');

describe('AuditController', () => {
    let auditController: AuditController;
    let mockAuditService: jest.Mocked<AuditService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockAuditService = new AuditService({} as any) as jest.Mocked<AuditService>;
        auditController = new AuditController(mockAuditService);

        mockJson = jest.fn();
        mockRequest = {} as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should retrieve all logs', async () => {
        const mockLogs = [
            { id: 1, userId: 1, action: 'CREATE', resource: 'User', resourceId: 1, timestamp: '2025-01-16T10:00:00Z' },
        ];

        mockAuditService.getAllLogs.mockResolvedValue(mockLogs);

        await auditController.getAllLogs(mockRequest as Request, mockResponse as Response);

        expect(mockAuditService.getAllLogs).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockLogs);
    });

    it('should handle errors when retrieving all logs', async () => {
        const error = new Error('Failed to retrieve logs');
        mockAuditService.getAllLogs.mockRejectedValue(error);

        await auditController.getAllLogs(mockRequest as Request, mockResponse as Response);

        expect(mockAuditService.getAllLogs).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });

    it('should retrieve logs by user', async () => {
        const mockLogs = [
            { id: 1, userId: 1, action: 'CREATE', resource: 'User', resourceId: 1, timestamp: '2025-01-16T10:00:00Z' },
        ];

        mockAuditService.getLogsByUser.mockResolvedValue(mockLogs);
        mockRequest.params = { userId: '1' };

        await auditController.getLogsByUser(mockRequest as Request, mockResponse as Response);

        expect(mockAuditService.getLogsByUser).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockLogs);
    });

    it('should handle errors when retrieving logs by user', async () => {
        const error = new Error('Failed to retrieve logs');
        mockAuditService.getLogsByUser.mockRejectedValue(error);
        mockRequest.params = { userId: '1' };

        await auditController.getLogsByUser(mockRequest as Request, mockResponse as Response);

        expect(mockAuditService.getLogsByUser).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
});
