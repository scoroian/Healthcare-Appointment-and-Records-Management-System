import { Container } from 'typedi';
import { SpecialtyService } from './specialty.service';
import { DatabaseService } from '../../database/database.service';
import { Specialty } from './specialty.model';

jest.mock('../../database/database.service');

describe('SpecialtyService', () => {
    let specialtyService: SpecialtyService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        specialtyService = new SpecialtyService(databaseService);
    });

    it('should create a specialty', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const specialty: Specialty = {
            id: 1,
            name: 'Cardiology',
            description: 'Heart-related treatments',
        };

        const result = await specialtyService.createSpecialty(specialty);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO specialties'),
            params: [specialty.name, specialty.description],
        });
    });

    it('should retrieve all specialties', async () => {
        const mockSpecialties = [
            {
                id: 1,
                name: 'Cardiology',
                description: 'Heart-related treatments',
            },
            {
                id: 2,
                name: 'Neurology',
                description: 'Brain and nervous system treatments',
            },
        ];
        databaseService.execQuery.mockResolvedValue({ rowCount: 2, rows: mockSpecialties });

        const result = await specialtyService.getAllSpecialties();
        expect(result).toEqual(mockSpecialties);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM specialties'),
        });
    });

    it('should retrieve a specialty by ID', async () => {
        const mockSpecialty = {
            id: 1,
            name: 'Cardiology',
            description: 'Heart-related treatments',
        };
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockSpecialty] });

        const result = await specialtyService.getSpecialtyById(1);
        expect(result).toEqual(mockSpecialty);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM specialties WHERE id = ?'),
            params: [1],
        });
    });

    it('should update a specialty', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const updates = { name: 'Updated Cardiology' };
        const result = await specialtyService.updateSpecialty(1, updates);

        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('UPDATE specialties SET'),
            params: [...Object.values(updates), 1],
        });
    });

    it('should delete a specialty', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await specialtyService.deleteSpecialty(1);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('DELETE FROM specialties WHERE id = ?'),
            params: [1],
        });
    });
});
