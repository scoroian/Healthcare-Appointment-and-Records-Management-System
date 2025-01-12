export interface MedicalRecord {
    id?: number;
    patientId: number;
    doctorId: number;
    diagnosis: string;
    prescriptions?: string;
    notes?: string;
    testResults?: string; // Resultados de pruebas en formato JSON o texto
    treatments?: string;  // Tratamientos en formato JSON o texto
    createdAt?: string;   // Fecha de creación
}
