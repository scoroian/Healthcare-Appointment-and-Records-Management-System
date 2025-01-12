import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';
import { MedicalRecord } from './medical-record.model';

@Service()
export class MedicalRecordService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Crear un registro médico
    public async createMedicalRecord(record: MedicalRecord): Promise<number> {
        const query = {
            sql: `INSERT INTO medical_records (patientId, doctorId, diagnosis, prescriptions, notes, testResults, treatments) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            params: [
                record.patientId,
                record.doctorId,
                record.diagnosis,
                record.prescriptions,
                record.notes,
                record.testResults,
                record.treatments,
            ],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Obtener todos los registros médicos (solo admins)
    public async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        const query = { sql: `SELECT * FROM medical_records` };
        const result = await this.databaseService.execQuery(query);
        return result.rows as MedicalRecord[];
    }

    // Obtener registros médicos de un paciente
    public async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
        console.log(patientId)
        const query = {
            sql: `SELECT * FROM medical_records WHERE patientId = ?`,
            params: [patientId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows as MedicalRecord[];
    }

    // Obtener un registro médico por ID
    public async getMedicalRecordById(recordId: number): Promise<MedicalRecord | null> {
        const query = {
            sql: `SELECT * FROM medical_records WHERE id = ?`,
            params: [recordId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows.length > 0 ? (result.rows[0] as MedicalRecord) : null;
    }

    // Actualizar un registro médico
    public async updateMedicalRecord(recordId: number, updates: Partial<MedicalRecord>): Promise<number> {
        const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
        const values = Object.values(updates);

        const query = {
            sql: `UPDATE medical_records SET ${fields} WHERE id = ?`,
            params: [...values, recordId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Eliminar un registro médico
    public async deleteMedicalRecord(recordId: number): Promise<number> {
        const query = {
            sql: `DELETE FROM medical_records WHERE id = ?`,
            params: [recordId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }
}
