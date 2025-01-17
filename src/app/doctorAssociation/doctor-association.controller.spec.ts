import { DoctorAssociationController } from './doctor-association.controller';
import { DoctorAssociationService } from './doctor-association.service';
import { Request, Response } from 'express';
import { logAuditAction } from '../middleware/middleware.audit';

jest.mock('./doctor-association.service');
jest.mock('../middleware/middleware.audit');

describe('DoctorAssociationController', () => {
    let doctorAssociationController: DoctorAssociationController;
    let mockDoctorAssociationService: jest.Mocked<DoctorAssociationService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockDoctorAssociationService = new DoctorAssociationService({} as any) as jest.Mocked<DoctorAssociationService>;
        doctorAssociationController = new DoctorAssociationController(mockDoctorAssociationService);

        mockJson = jest.fn();
        mockRequest = {} as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should assign a specialty to a doctor', async () => {
        mockDoctorAssociationService.assignSpecialtyToDoctor.mockResolvedValue(1);
        mockRequest.body = { doctorId: 1, specialtyId: 2 };

        await doctorAssociationController.assignSpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.assignSpecialtyToDoctor).toHaveBeenCalledWith(1, 2);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'ASIGN-SPECIALTY', 'Doctor: 1', 2);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Specialty assigned to doctor successfully' });
    });

    it('should assign a department to a doctor', async () => {
        mockDoctorAssociationService.assignDepartmentToDoctor.mockResolvedValue(1);
        mockRequest.body = { doctorId: 1, departmentId: 3 };

        await doctorAssociationController.assignDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.assignDepartmentToDoctor).toHaveBeenCalledWith(1, 3);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'ASIGN-DEPARTMENT', 'Doctor: 1', 3);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Department assigned to doctor successfully' });
    });

    it('should retrieve specialties of a doctor', async () => {
        const mockSpecialties = [
            { id: 1, name: 'Cardiology', description: 'Heart-related specialty' },
        ];

        mockDoctorAssociationService.getDoctorSpecialties.mockResolvedValue(mockSpecialties);
        mockRequest.params = { doctorId: '1' };

        await doctorAssociationController.getDoctorSpecialties(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.getDoctorSpecialties).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockSpecialties);
    });

    it('should retrieve departments of a doctor', async () => {
        const mockDepartments = [
            { id: 1, name: 'Cardiology', description: 'Heart-related department' },
        ];

        mockDoctorAssociationService.getDoctorDepartments.mockResolvedValue(mockDepartments);
        mockRequest.params = { doctorId: '1' };

        await doctorAssociationController.getDoctorDepartments(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.getDoctorDepartments).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockDepartments);
    });

    it('should retrieve doctors by specialty', async () => {
        const mockDoctors = [
            { id: 1, username: 'Dr. John', email: 'john@example.com', role: 'doctor' },
        ];

        mockDoctorAssociationService.getDoctorsBySpecialty.mockResolvedValue(mockDoctors);
        mockRequest.params = { specialtyId: '1' };

        await doctorAssociationController.getDoctorsBySpecialty(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.getDoctorsBySpecialty).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockDoctors);
    });

    it('should retrieve doctors by department', async () => {
        const mockDoctors = [
            { id: 1, username: 'Dr. John', email: 'john@example.com', role: 'doctor' },
        ];

        mockDoctorAssociationService.getDoctorsByDepartment.mockResolvedValue(mockDoctors);
        mockRequest.params = { departmentId: '1' };

        await doctorAssociationController.getDoctorsByDepartment(mockRequest as Request, mockResponse as Response);

        expect(mockDoctorAssociationService.getDoctorsByDepartment).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockDoctors);
    });
});

