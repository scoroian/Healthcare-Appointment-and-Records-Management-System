import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AppointmentService } from './appointment.service';
import {NotificationService} from "../notification/notification.service";

@Service()
export class AppointmentController {
    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly notificationService: NotificationService
    ) {}

    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointment = req.body;
            const result = await this.appointmentService.createAppointment(appointment);

            this.notificationService.sendNotification(appointment.patientId, `Your appointment with doctor ${appointment.doctorId} on ${appointment.dateTime} has been confirmed.`);
            res.status(201).json({ message: 'Appointment created successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAppointments(req: Request, res: Response): Promise<void> {
        try {
            const { role, id } = (req as any).user;
            console.log(role)
            console.log(id)
            const appointments =
                role === 'admin'
                    ? await this.appointmentService.getAllAppointments()
                    : await this.appointmentService.getAppointmentsByUser(id, role);

            res.status(200).json(appointments);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateAppointment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Buscar si la cita existe
            const appointment = await this.appointmentService.getAppointmentById(Number(id));
            if (!appointment) {
                res.status(404).json({ message: 'Appointment not found' });
            }

            // Realizar la actualización
            await this.appointmentService.updateAppointment(Number(id), updates);
            // Enviar notificación al paciente sobre el cambio
            this.notificationService.sendNotification(
                appointment?.patientId,
                `Your appointment has been updated: ${JSON.stringify(updates)}`
            );
            // Responder con éxito
            res.status(200).json({ message: 'Appointment updated successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteAppointment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const appointment = await this.appointmentService.getAppointmentById(Number(id));
            if (!appointment) {
                res.status(404).json({ message: 'Appointment not found' });
            }

            const result = await this.appointmentService.deleteAppointment(Number(id));

            // Enviar notificación al paciente sobre la cancelación
            this.notificationService.sendNotification(appointment?.patientId, `Your appointment with doctor ${appointment?.doctorId} has been canceled.`);

            res.status(200).json({ message: 'Appointment deleted successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
