export interface Appointment {
    id?: number;
    patientId: number;
    doctorId: number;
    dateTime: string; // ISO 8601 string
    reason?: string;
    status: 'confirmed' | 'canceled' | 'rescheduled'; // Estado de la cita
}
