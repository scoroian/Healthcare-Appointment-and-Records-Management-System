import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';
import { Specialty } from './specialty.model';

@Service()
export class SpecialtyService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Crear una especialidad
    public async createSpecialty(specialty: Specialty): Promise<number> {
        const query = {
            sql: `INSERT INTO specialties (name, description) VALUES (?, ?)`,
            params: [specialty.name, specialty.description],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Obtener todas las especialidades
    public async getAllSpecialties(): Promise<Specialty[]> {
        const query = { sql: `SELECT * FROM specialties` };
        const result = await this.databaseService.execQuery(query);
        return result.rows as Specialty[];
    }

    // Obtener una especialidad por ID
    public async getSpecialtyById(id: number): Promise<Specialty | null> {
        const query = { sql: `SELECT * FROM specialties WHERE id = ?`, params: [id] };
        const result = await this.databaseService.execQuery(query);
        return result.rows.length > 0 ? (result.rows[0] as Specialty) : null;
    }

    // Actualizar una especialidad
    public async updateSpecialty(id: number, updates: Partial<Specialty>): Promise<number> {
        const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
        const values = Object.values(updates);

        const query = {
            sql: `UPDATE specialties SET ${fields} WHERE id = ?`,
            params: [...values, id],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Eliminar una especialidad
    public async deleteSpecialty(id: number): Promise<number> {
        const query = { sql: `DELETE FROM specialties WHERE id = ?`, params: [id] };
        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }
}
