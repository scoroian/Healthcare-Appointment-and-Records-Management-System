import { Container } from 'typedi';
import { AppointmentService } from './appointment.service';
import { DatabaseService } from '../../database/database.service';
import { Appointment } from './appointment.model';

jest.mock('../../database/database.service');

describe('AppointmentService', () => {
    let appointmentService: AppointmentService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        appointmentService = new AppointmentService(databaseService);
    });

    it('should create an appointment', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const appointment: Appointment = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            dateTime: '2025-01-16T10:00:00Z',
            reason: 'Check-up',
            status: 'confirmed',
        };

        const result = await appointmentService.createAppointment(appointment);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO appointments'),
            params: [appointment.patientId, appointment.doctorId, appointment.dateTime, appointment.reason, appointment.status],
        });
    });

    it('should retrieve all appointments', async () => {
        const mockAppointments = [
            {
                id: 1,
                patientId: 1,
                doctorId: 2,
                dateTime: '2025-01-16T10:00:00Z',
                reason: 'Check-up',
                status: 'confirmed',
            },
        ];
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockAppointments });

        const result = await appointmentService.getAllAppointments();
        expect(result).toEqual(mockAppointments);
        expect(databaseService.execQuery).toHaveBeenCalledWith({ sql: expect.stringContaining('SELECT * FROM appointments') });
    });

    it('should retrieve appointments by patient role', async () => {
        const mockAppointments = [
            {
                id: 1,
                patientId: 1,
                doctorId: 2,
                dateTime: '2025-01-16T10:00:00Z',
                reason: 'Check-up',
                status: 'confirmed',
            },
        ];
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockAppointments });

        const result = await appointmentService.getAppointmentsByUser(1, 'patient');
        expect(result).toEqual(mockAppointments);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM appointments WHERE patientId = ?'),
            params: [1],
        });
    });

    it('should update an appointment', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const updates = { reason: 'Updated Reason' };
        const result = await appointmentService.updateAppointment(1, updates);

        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('UPDATE appointments SET'),
            params: [...Object.values(updates), 1],
        });
    });

    it('should delete an appointment', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await appointmentService.deleteAppointment(1);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('DELETE FROM appointments WHERE id = ?'),
            params: [1],
        });
    });

    it('should retrieve an appointment by ID', async () => {
        const mockAppointment = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            dateTime: '2025-01-16T10:00:00Z',
            reason: 'Check-up',
            status: 'confirmed',
        };
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockAppointment] });

        const result = await appointmentService.getAppointmentById(1);
        expect(result).toEqual(mockAppointment);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM appointments WHERE id = ?'),
            params: [1],
        });
    });
});
