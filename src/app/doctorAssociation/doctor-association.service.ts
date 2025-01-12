import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';

@Service()
export class DoctorAssociationService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Asignar una especialidad a un doctor
    public async assignSpecialtyToDoctor(doctorId: number, specialtyId: number): Promise<number> {
        const query = {
            sql: `INSERT INTO doctor_specialties (doctorId, specialtyId) VALUES (?, ?)`,
            params: [doctorId, specialtyId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Asignar un departamento a un doctor
    public async assignDepartmentToDoctor(doctorId: number, departmentId: number): Promise<number> {
        const query = {
            sql: `INSERT INTO doctor_departments (doctorId, departmentId) VALUES (?, ?)`,
            params: [doctorId, departmentId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Obtener las especialidades de un doctor
    public async getDoctorSpecialties(doctorId: number): Promise<any[]> {
        const query = {
            sql: `SELECT specialties.* FROM doctor_specialties 
            INNER JOIN specialties ON doctor_specialties.specialtyId = specialties.id
            WHERE doctor_specialties.doctorId = ?`,
            params: [doctorId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }

    // Obtener los departamentos de un doctor
    public async getDoctorDepartments(doctorId: number): Promise<any[]> {
        const query = {
            sql: `SELECT departments.* FROM doctor_departments 
            INNER JOIN departments ON doctor_departments.departmentId = departments.id
            WHERE doctor_departments.doctorId = ?`,
            params: [doctorId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }


    // Obtener doctores por especialidad
    public async getDoctorsBySpecialty(specialtyId: number): Promise<any[]> {
        const query = {
            sql: `
                SELECT users.id, users.username, users.email, users.role
                FROM doctor_specialties
                INNER JOIN users ON doctor_specialties.doctorId = users.id
                WHERE doctor_specialties.specialtyId = ? AND users.role = 'doctor'
            `,
            params: [specialtyId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }

    // Obtener doctores por departamento
    public async getDoctorsByDepartment(departmentId: number): Promise<any[]> {
        const query = {
            sql: `
                SELECT users.id, users.username, users.email, users.role
                FROM doctor_departments
                INNER JOIN users ON doctor_departments.doctorId = users.id
                WHERE doctor_departments.departmentId = ? AND users.role = 'doctor'
            `,
            params: [departmentId],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }

}
