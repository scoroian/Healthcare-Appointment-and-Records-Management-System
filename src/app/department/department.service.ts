import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';
import { Department } from './department.model';

@Service()
export class DepartmentService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Crear un departamento
    public async createDepartment(department: Department): Promise<number> {
        const query = {
            sql: `INSERT INTO departments (name, description) VALUES (?, ?)`,
            params: [department.name, department.description],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Obtener todos los departamentos
    public async getAllDepartments(): Promise<Department[]> {
        const query = { sql: `SELECT * FROM departments` };
        const result = await this.databaseService.execQuery(query);
        return result.rows as Department[];
    }

    // Obtener un departamento por ID
    public async getDepartmentById(id: number): Promise<Department | null> {
        const query = { sql: `SELECT * FROM departments WHERE id = ?`, params: [id] };
        const result = await this.databaseService.execQuery(query);
        return result.rows.length > 0 ? (result.rows[0] as Department) : null;
    }

    // Actualizar un departamento
    public async updateDepartment(id: number, updates: Partial<Department>): Promise<number> {
        const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
        const values = Object.values(updates);

        const query = {
            sql: `UPDATE departments SET ${fields} WHERE id = ?`,
            params: [...values, id],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Eliminar un departamento
    public async deleteDepartment(id: number): Promise<number> {
        const query = { sql: `DELETE FROM departments WHERE id = ?`, params: [id] };
        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }
}
