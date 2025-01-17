import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { NotificationService } from '../notification/notification.service';
import { Request, Response } from 'express';
import { logAuditAction } from '../middleware/middleware.audit';
import {Appointment} from "./appointment.model";

jest.mock('./appointment.service');
jest.mock('../notification/notification.service');
jest.mock('../middleware/middleware.audit');

describe('AppointmentController', () => {
    let appointmentController: AppointmentController;
    let mockAppointmentService: jest.Mocked<AppointmentService>;
    let mockNotificationService: jest.Mocked<NotificationService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockAppointmentService = new AppointmentService({} as any) as jest.Mocked<AppointmentService>;
        mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;

        appointmentController = new AppointmentController(mockAppointmentService, mockNotificationService);

        mockJson = jest.fn();
        mockRequest = { user: { id: 1, role: 'admin' } } as Partial<Request>;
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) } as Partial<Response>;
    });

    it('should create an appointment', async () => {
        mockAppointmentService.createAppointment.mockResolvedValue(1);
        mockNotificationService.sendNotification.mockImplementation(jest.fn());

        mockRequest.body = {
            id: 1,
            patientId: 2,
            doctorId: 3,
            dateTime: '2025-01-16T10:00:00Z',
        };

        await appointmentController.createAppointment(mockRequest as Request, mockResponse as Response);

        expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith(mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'CREATE', 'Appointment', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'Your appointment with doctor 3 on 2025-01-16T10:00:00Z has been confirmed.'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Appointment created successfully' });
    });

    it('should retrieve all appointments for admin', async () => {
        const mockAppointments = [
            {
                id: 1,
                patientId: 2,
                doctorId: 3,
                dateTime: '2025-01-16T10:00:00Z',
                status: 'confirmed', // Usar valores válidos
            },
        ] as Appointment[];

        mockAppointmentService.getAllAppointments.mockResolvedValue(mockAppointments);

        await appointmentController.getAppointments(mockRequest as Request, mockResponse as Response);

        expect(mockAppointmentService.getAllAppointments).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockAppointments);
    });

    it('should update an appointment', async () => {
        mockAppointmentService.getAppointmentById.mockResolvedValue({
            id: 1,
            patientId: 2,
            doctorId: 3,
            dateTime: '2025-01-16T10:00:00Z',
            status: 'rescheduled'
        });

        mockRequest.params = { id: '1' };
        mockRequest.body = { dateTime: '2025-01-17T10:00:00Z' };

        await appointmentController.updateAppointment(mockRequest as Request, mockResponse as Response);

        expect(mockAppointmentService.updateAppointment).toHaveBeenCalledWith(1, mockRequest.body);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'UPDATE', 'Appointment', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'Your appointment has been updated: {"dateTime":"2025-01-17T10:00:00Z"}'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Appointment updated successfully' });
    });

    it('should delete an appointment', async () => {
        mockAppointmentService.getAppointmentById.mockResolvedValue({
            id: 1,
            patientId: 2,
            doctorId: 3,
            dateTime: '2025-01-16T10:00:00Z',
            status: 'confirmed'
        });

        mockRequest.params = { id: '1' };

        await appointmentController.deleteAppointment(mockRequest as Request, mockResponse as Response);

        expect(mockAppointmentService.deleteAppointment).toHaveBeenCalledWith(1);
        expect(logAuditAction).toHaveBeenCalledWith(mockRequest, 'DELETE', 'Appointment', 1);
        expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
            2,
            'Your appointment with doctor 3 has been canceled.'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Appointment deleted successfully' });
    });
});
