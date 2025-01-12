import { Service } from 'typedi';
import { Request, Response } from 'express';
import { MedicalRecordService } from './medical-record.service';
import {MedicalRecord} from "./medical-record.model";

@Service()
export class MedicalRecordController {
    constructor(private readonly medicalRecordService: MedicalRecordService) {}

    async createMedicalRecord(req: Request, res: Response): Promise<void> {
        try {
            const record = req.body;
            const result = await this.medicalRecordService.createMedicalRecord(record);

            res.status(201).json({ message: 'Medical record created successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getMedicalRecords(req: Request, res: Response): Promise<void> {
        try {
            const { role, id } = (req as any).user;

            let records: MedicalRecord[] = [];
            if (role === 'admin') {
                records = await this.medicalRecordService.getAllMedicalRecords();
            } else if (role === 'patient') {
                records = await this.medicalRecordService.getMedicalRecordsByPatient(id);
            }

            res.status(200).json(records);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateMedicalRecord(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const record = await this.medicalRecordService.getMedicalRecordById(Number(id));
            if (!record) {
                res.status(404).json({ message: 'Medical record not found' });
            }

            await this.medicalRecordService.updateMedicalRecord(Number(id), updates);
            res.status(200).json({ message: 'Medical record updated successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteMedicalRecord(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const record = await this.medicalRecordService.getMedicalRecordById(Number(id));
            if (!record) {
                res.status(404).json({ message: 'Medical record not found' });
            }

            await this.medicalRecordService.deleteMedicalRecord(Number(id));
            res.status(200).json({ message: 'Medical record deleted successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
