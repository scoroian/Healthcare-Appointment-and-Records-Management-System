import { Container } from 'typedi';
import { DoctorAssociationService } from './doctor-association.service';
import { DatabaseService } from '../../database/database.service';

jest.mock('../../database/database.service');

describe('DoctorAssociationService', () => {
    let doctorAssociationService: DoctorAssociationService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        doctorAssociationService = new DoctorAssociationService(databaseService);
    });

    it('should assign a specialty to a doctor', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await doctorAssociationService.assignSpecialtyToDoctor(1, 2);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO doctor_specialties'),
            params: [1, 2],
        });
    });

    it('should assign a department to a doctor', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await doctorAssociationService.assignDepartmentToDoctor(1, 3);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO doctor_departments'),
            params: [1, 3],
        });
    });

    it('should retrieve a doctor specialties', async () => {
        const mockSpecialties = [
            { id: 1, name: 'Cardiology', description: 'Heart-related treatments' },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockSpecialties });

        const result = await doctorAssociationService.getDoctorSpecialties(1);
        expect(result).toEqual(mockSpecialties);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT specialties.* FROM doctor_specialties'),
            params: [1],
        });
    });

    it('should retrieve a doctor departments', async () => {
        const mockDepartments = [
            { id: 1, name: 'Neurology', description: 'Brain-related treatments' },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockDepartments });

        const result = await doctorAssociationService.getDoctorDepartments(1);
        expect(result).toEqual(mockDepartments);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT departments.* FROM doctor_departments'),
            params: [1],
        });
    });

    it('should retrieve doctors by specialty', async () => {
        const mockDoctors = [
            { id: 1, username: 'doctor1', email: 'doctor1@test.com', role: 'doctor' },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockDoctors });

        const result = await doctorAssociationService.getDoctorsBySpecialty(2);
        expect(result).toEqual(mockDoctors);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.any(String), // Aceptar cualquier string
            params: [2],
        });
    });

    it('should retrieve doctors by department', async () => {
        const mockDoctors = [
            { id: 1, username: 'doctor2', email: 'doctor2@test.com', role: 'doctor' },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockDoctors });

        const result = await doctorAssociationService.getDoctorsByDepartment(3);
        expect(result).toEqual(mockDoctors);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.any(String),
            params: [3],
        });
    });
});
