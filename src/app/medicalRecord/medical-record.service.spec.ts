import { Container } from 'typedi';
import { MedicalRecordService } from './medical-record.service';
import { DatabaseService } from '../../database/database.service';
import { MedicalRecord } from './medical-record.model';

jest.mock('../../database/database.service');

describe('MedicalRecordService', () => {
    let medicalRecordService: MedicalRecordService;
    let databaseService: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        databaseService = new DatabaseService() as jest.Mocked<DatabaseService>;
        medicalRecordService = new MedicalRecordService(databaseService);
    });

    it('should create a medical record', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const record: MedicalRecord = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            diagnosis: 'Flu',
            prescriptions: 'Paracetamol',
            notes: 'Patient recovering well',
            testResults: 'Negative',
            treatments: 'Rest and fluids',
        };

        const result = await medicalRecordService.createMedicalRecord(record);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('INSERT INTO medical_records'),
            params: [
                record.patientId,
                record.doctorId,
                record.diagnosis,
                record.prescriptions,
                record.notes,
                record.testResults,
                record.treatments,
            ],
        });
    });

    it('should retrieve all medical records', async () => {
        const mockRecords = [
            {
                id: 1,
                patientId: 1,
                doctorId: 2,
                diagnosis: 'Flu',
                prescriptions: 'Paracetamol',
                notes: 'Patient recovering well',
                testResults: 'Negative',
                treatments: 'Rest and fluids',
            },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockRecords });

        const result = await medicalRecordService.getAllMedicalRecords();
        expect(result).toEqual(mockRecords);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM medical_records'),
        });
    });

    it('should retrieve medical records by patient', async () => {
        const mockRecords = [
            {
                id: 1,
                patientId: 1,
                doctorId: 2,
                diagnosis: 'Flu',
                prescriptions: 'Paracetamol',
                notes: 'Patient recovering well',
                testResults: 'Negative',
                treatments: 'Rest and fluids',
            },
        ];

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: mockRecords });

        const result = await medicalRecordService.getMedicalRecordsByPatient(1);
        expect(result).toEqual(mockRecords);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM medical_records WHERE patientId = ?'),
            params: [1],
        });
    });

    it('should retrieve a medical record by ID', async () => {
        const mockRecord = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            diagnosis: 'Flu',
            prescriptions: 'Paracetamol',
            notes: 'Patient recovering well',
            testResults: 'Negative',
            treatments: 'Rest and fluids',
        };

        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [mockRecord] });

        const result = await medicalRecordService.getMedicalRecordById(1);
        expect(result).toEqual(mockRecord);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('SELECT * FROM medical_records WHERE id = ?'),
            params: [1],
        });
    });

    it('should update a medical record', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const updates = { diagnosis: 'Updated Flu' };
        const result = await medicalRecordService.updateMedicalRecord(1, updates);

        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('UPDATE medical_records SET'),
            params: [...Object.values(updates), 1],
        });
    });

    it('should delete a medical record', async () => {
        databaseService.execQuery.mockResolvedValue({ rowCount: 1, rows: [] });

        const result = await medicalRecordService.deleteMedicalRecord(1);
        expect(result).toBe(1);
        expect(databaseService.execQuery).toHaveBeenCalledWith({
            sql: expect.stringContaining('DELETE FROM medical_records WHERE id = ?'),
            params: [1],
        });
    });
});
