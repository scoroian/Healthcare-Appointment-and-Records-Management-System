import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Request, Response } from 'express';
import { logAuditAction } from '../middleware/middleware.audit';

jest.mock('./department.service');
jest.mock('../middleware/middleware.audit');

describe('DepartmentController', () => {
    let departmentController: DepartmentController;
    let mockDepartmentService: jest.Mocked<DepartmentService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockDepartmentService = new DepartmentService({} as any) as jest.Mocked<DepartmentService>;
        departmentController = new DepartmentController(mockDepartmentService);

        mockJson = jest.fn();
        mockRequest = {} as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should create a department', async () => {
        mockDepartmentService.createDepartment.mockResolvedValue(1);
        mockRequest.body = { name: 'Cardiology', description: 'Heart-related department' };

        await departmentController.createDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.createDepartment).toHaveBeenCalledWith(mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'CREATE', 'Department', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department created successfully' });
    });

    it('should retrieve all departments', async () => {
        const mockDepartments = [
            { id: 1, name: 'Cardiology', description: 'Heart-related department' },
        ];

        mockDepartmentService.getAllDepartments.mockResolvedValue(mockDepartments);

        await departmentController.getAllDepartments(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.getAllDepartments).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockDepartments);
    });

    it('should retrieve a department by ID', async () => {
        const mockDepartment = { id: 1, name: 'Cardiology', description: 'Heart-related department' };

        mockDepartmentService.getDepartmentById.mockResolvedValue(mockDepartment);
        mockRequest.params = { id: '1' };

        await departmentController.getDepartmentById(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.getDepartmentById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockDepartment);
    });

    it('should return 404 if department not found by ID', async () => {
        mockDepartmentService.getDepartmentById.mockResolvedValue(null);
        mockRequest.params = { id: '1' };

        await departmentController.getDepartmentById(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.getDepartmentById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department not found' });
    });

    it('should update a department', async () => {
        mockDepartmentService.getDepartmentById.mockResolvedValue({ id: 1, name: 'Cardiology', description: 'Heart' });
        mockRequest.params = { id: '1' };
        mockRequest.body = { description: 'Updated description' };

        await departmentController.updateDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.updateDepartment).toHaveBeenCalledWith(1, mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'UPDATE', 'Department', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department updated successfully' });
    });

    it('should delete a department', async () => {
        mockDepartmentService.getDepartmentById.mockResolvedValue({ id: 1, name: 'Cardiology', description: 'Heart' });
        mockRequest.params = { id: '1' };

        await departmentController.deleteDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.deleteDepartment).toHaveBeenCalledWith(1);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'DELETE', 'Department', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department deleted successfully' });
    });

    it('should return 404 if department not found for deletion', async () => {
        mockDepartmentService.getDepartmentById.mockResolvedValue(null);
        mockRequest.params = { id: '1' };

        await departmentController.deleteDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDepartmentService.getDepartmentById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department not found' });
    });
});
