import { Service } from 'typedi';
import { Request, Response } from 'express';
import { SpecialtyService } from './specialty.service';
import {logAuditAction} from "../middleware/middleware.audit";

@Service()
export class SpecialtyController {
    constructor(private readonly specialtyService: SpecialtyService) {}

    async createSpecialty(req: Request, res: Response): Promise<void> {
        try {
            const specialty = req.body;
            const result = await this.specialtyService.createSpecialty(specialty);

            // Registrar auditoría
            await logAuditAction(req, 'CREATE', 'Specialty', result);

            res.status(201).json({ message: 'Specialty created successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllSpecialties(req: Request, res: Response): Promise<void> {
        try {
            const specialties = await this.specialtyService.getAllSpecialties();
            res.status(200).json(specialties);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getSpecialtyById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const specialty = await this.specialtyService.getSpecialtyById(Number(id));

            if (specialty) {
                res.status(200).json(specialty);
            } else {
                res.status(404).json({ message: 'Specialty not found' });
            }
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateSpecialty(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const specialty = await this.specialtyService.getSpecialtyById(Number(id));
            if (!specialty) {
                res.status(404).json({ message: 'Specialty not found' });
            }

            await this.specialtyService.updateSpecialty(Number(id), updates);

            // Registrar auditoría
            await logAuditAction(req, 'UPDATE', 'Specialty', Number(id));

            res.status(200).json({ message: 'Specialty updated successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteSpecialty(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const specialty = await this.specialtyService.getSpecialtyById(Number(id));
            if (!specialty) {
                res.status(404).json({ message: 'Specialty not found' });
            }

            await this.specialtyService.deleteSpecialty(Number(id));

            // Registrar auditoría
            await logAuditAction(req, 'DELETE', 'Specialty', Number(id));

            res.status(200).json({ message: 'Specialty deleted successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
