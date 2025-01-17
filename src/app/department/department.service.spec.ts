import { Container } from 'typedi';
import { DepartmentService } from './department.service';
import { DatabaseService } from '../../database/database.service';
import { Department } from './department.model';

jest.mock('../../database/database.service');

describe('DepartmentService', () => {
    let departmentService: DepartmentService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        departmentService = new DepartmentService(databaseService);
    });

    it('should create a department', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const department: Department = {
            id: 1,
            name: 'Cardiology',
            description: 'Heart-related treatments',
        };

        const result = await departmentService.createDepartment(department);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO departments'),
            params: [department.name, department.description],
        });
    });

    it('should retrieve all departments', async () => {
        const mockDepartments = [
            {
                id: 1,
                name: 'Cardiology',
                description: 'Heart-related treatments',
            },
            {
                id: 2,
                name: 'Neurology',
                description: 'Brain and nervous system',
            },
        ];
        databaseService.execQuery.mockResolvedValue({ rowCount: 2, rows: mockDepartments });

        const result = await departmentService.getAllDepartments();
        expect(result).toEqual(mockDepartments);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM departments'),
        });
    });

    it('should retrieve a department by ID', async () => {
        const mockDepartment = {
            id: 1,
            name: 'Cardiology',
            description: 'Heart-related treatments',
        };
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockDepartment] });

        const result = await departmentService.getDepartmentById(1);
        expect(result).toEqual(mockDepartment);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM departments WHERE id = ?'),
            params: [1],
        });
    });

    it('should update a department', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const updates = { name: 'Updated Cardiology' };
        const result = await departmentService.updateDepartment(1, updates);

        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('UPDATE departments SET'),
            params: [...Object.values(updates), 1],
        });
    });

    it('should delete a department', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await departmentService.deleteDepartment(1);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('DELETE FROM departments WHERE id = ?'),
            params: [1],
        });
    });
});
