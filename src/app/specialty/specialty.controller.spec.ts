import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { Request, Response } from 'express';
import { logAuditAction } from '../middleware/middleware.audit';

jest.mock('./specialty.service');
jest.mock('../middleware/middleware.audit');

describe('SpecialtyController', () => {
    let specialtyController: SpecialtyController;
    let mockSpecialtyService: jest.Mocked<SpecialtyService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockSpecialtyService = new SpecialtyService({} as any) as jest.Mocked<SpecialtyService>;
        specialtyController = new SpecialtyController(mockSpecialtyService);

        mockJson = jest.fn();
        mockRequest = {} as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should create a specialty', async () => {
        mockSpecialtyService.createSpecialty.mockResolvedValue(1);
        mockRequest.body = { name: 'Cardiology', description: 'Heart-related specialty' };

        await specialtyController.createSpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.createSpecialty).toHaveBeenCalledWith(mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'CREATE', 'Specialty', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty created successfully' });
    });

    it('should retrieve all specialties', async () => {
        const mockSpecialties = [
            { id: 1, name: 'Cardiology', description: 'Heart-related specialty' },
        ];

        mockSpecialtyService.getAllSpecialties.mockResolvedValue(mockSpecialties);

        await specialtyController.getAllSpecialties(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.getAllSpecialties).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockSpecialties);
    });

    it('should retrieve a specialty by ID', async () => {
        const mockSpecialty = { id: 1, name: 'Cardiology', description: 'Heart-related specialty' };

        mockSpecialtyService.getSpecialtyById.mockResolvedValue(mockSpecialty);
        mockRequest.params = { id: '1' };

        await specialtyController.getSpecialtyById(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.getSpecialtyById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockSpecialty);
    });

    it('should return 404 if specialty not found by ID', async () => {
        mockSpecialtyService.getSpecialtyById.mockResolvedValue(null);
        mockRequest.params = { id: '1' };

        await specialtyController.getSpecialtyById(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.getSpecialtyById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty not found' });
    });

    it('should update a specialty', async () => {
        mockSpecialtyService.getSpecialtyById.mockResolvedValue({ id: 1, name: 'Cardiology', description: 'Heart' });
        mockRequest.params = { id: '1' };
        mockRequest.body = { description: 'Updated description' };

        await specialtyController.updateSpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.updateSpecialty).toHaveBeenCalledWith(1, mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'UPDATE', 'Specialty', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty updated successfully' });
    });

    it('should delete a specialty', async () => {
        mockSpecialtyService.getSpecialtyById.mockResolvedValue({ id: 1, name: 'Cardiology', description: 'Heart' });
        mockRequest.params = { id: '1' };

        await specialtyController.deleteSpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.deleteSpecialty).toHaveBeenCalledWith(1);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'DELETE', 'Specialty', 1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty deleted successfully' });
    });

    it('should return 404 if specialty not found for deletion', async () => {
        mockSpecialtyService.getSpecialtyById.mockResolvedValue(null);
        mockRequest.params = { id: '1' };

        await specialtyController.deleteSpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockSpecialtyService.getSpecialtyById).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty not found' });
    });
});
