import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { NotificationService } from '../notification/notification.service';
import { Request, Response } from 'express';
import { logAuditAction } from '../middleware/middleware.audit';

jest.mock('./medical-record.service');
jest.mock('../notification/notification.service');
jest.mock('../middleware/middleware.audit');

describe('MedicalRecordController', () => {
    let medicalRecordController: MedicalRecordController;
    let mockMedicalRecordService: jest.Mocked<MedicalRecordService>;
    let mockNotificationService: jest.Mocked<NotificationService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockMedicalRecordService = new MedicalRecordService({} as any) as jest.Mocked<MedicalRecordService>;
        mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;

        medicalRecordController = new MedicalRecordController(
            mockMedicalRecordService,
            mockNotificationService
        );

        mockJson = jest.fn();
        mockRequest = { user: { id: 1, role: 'admin' } } as Partial<Request>;
        mockResponse = {
            status: jest.fn().mockReturnValue({ json: mockJson }),
        } as Partial<Response>;
    });

    it('should create a medical record', async () => {
        mockMedicalRecordService.createMedicalRecord.mockResolvedValue(1);
        mockNotificationService.sendNotification.mockImplementation(jest.fn());

        mockRequest.body = {
            patientId: 2,
            doctorId: 3,
            diagnosis: 'Flu',
            prescriptions: 'Rest and hydration',
            notes: 'Check back in a week.',
        };

        await medicalRecordController.createMedicalRecord(mockRequest as Request, mockResponse as Response);

        expect(mockMedicalRecordService.createMedicalRecord).toHaveBeenCalledWith(mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'CREATE', 'Medical record', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'A new medical record has been created for you by doctor 3. Diagnosis: Flu.'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Medical record created successfully' });
    });

    it('should retrieve medical records for admin', async () => {
        const mockRecords = [
            { id: 1, patientId: 2, doctorId: 3, diagnosis: 'Flu', prescriptions: 'Rest', notes: 'Notes' },
        ];

        mockMedicalRecordService.getAllMedicalRecords.mockResolvedValue(mockRecords);

        await medicalRecordController.getMedicalRecords(mockRequest as Request, mockResponse as Response);

        expect(mockMedicalRecordService.getAllMedicalRecords).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockRecords);
    });

    it('should update a medical record', async () => {
        mockMedicalRecordService.getMedicalRecordById.mockResolvedValue({
            id: 1,
            patientId: 2,
            doctorId: 3,
            diagnosis: 'Flu',
        });

        mockRequest.params = { id: '1' };
        mockRequest.body = { diagnosis: 'Severe Flu' };

        await medicalRecordController.updateMedicalRecord(mockRequest as Request, mockResponse as Response);

        expect(mockMedicalRecordService.updateMedicalRecord).toHaveBeenCalledWith(1, mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'UPDATE', 'Medical record', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'Your medical record has been updated by doctor 3. Updates: {"diagnosis":"Severe Flu"}'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Medical record updated successfully' });
    });

    it('should delete a medical record', async () => {
        mockMedicalRecordService.getMedicalRecordById.mockResolvedValue({
            id: 1,
            patientId: 2,
            doctorId: 3,
            diagnosis: 'Flu',
        });

        mockRequest.params = { id: '1' };

        await medicalRecordController.deleteMedicalRecord(mockRequest as Request, mockResponse as Response);

        expect(mockMedicalRecordService.deleteMedicalRecord).toHaveBeenCalledWith(1);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'DELETE', 'Medical record', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'A medical record has been removed from your profile by admin. Diagnosis: Flu.'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Medical record deleted successfully' });
    });
});
