import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';
import { Appointment } from './appointment.model';

@Service()
export class AppointmentService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Crear una cita
    public async createAppointment(appointment: Appointment): Promise<number> {
        const query = {
            sql: `INSERT INTO appointments (patientId, doctorId, dateTime, reason, status) VALUES (?, ?, ?, ?, ?)`,
            params: [appointment.patientId, appointment.doctorId, appointment.dateTime, appointment.reason, appointment.status],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Obtener todas las citas
    public async getAllAppointments(): Promise<Appointment[]> {
        const query = { sql: `SELECT * FROM appointments` };
        const result = await this.databaseService.execQuery(query);
        return result.rows as Appointment[];
    }

    // Obtener citas por paciente o doctor
    public async getAppointmentsByUser(userId: number, role: string): Promise<Appointment[]> {
        const query =
            role === 'patient'
                ? { sql: `SELECT * FROM appointments WHERE patientId = ?`, params: [userId] }
                : { sql: `SELECT * FROM appointments WHERE doctorId = ?`, params: [userId] };

        const result = await this.databaseService.execQuery(query);
        return result.rows as Appointment[];
    }

    // Actualizar una cita
    public async updateAppointment(appointmentId: number, updates: Partial<Appointment>): Promise<number> {
        const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
        const values = Object.values(updates);

        const query = {
            sql: `UPDATE appointments SET ${fields} WHERE id = ?`,
            params: [...values, appointmentId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Eliminar una cita
    public async deleteAppointment(appointmentId: number): Promise<number> {
        const query = {
            sql: `DELETE FROM appointments WHERE id = ?`,
            params: [appointmentId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Buscar una cita por su ID
    public async getAppointmentById(appointmentId: number): Promise<Appointment | null> {
        const query = {
            sql: `SELECT * FROM appointments WHERE id = ?`,
            params: [appointmentId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows.length > 0 ? (result.rows[0] as Appointment) : null;
    }

}
