import { Service } from 'typedi';
import { Request, Response } from 'express';
import { DoctorAssociationService } from './doctor-association.service';

@Service()
export class DoctorAssociationController {
    constructor(private readonly doctorAssociationService: DoctorAssociationService) {}

    async assignSpecialty(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId, specialtyId } = req.body;

            const result = await this.doctorAssociationService.assignSpecialtyToDoctor(doctorId, specialtyId);

            res.status(201).json({ message: 'Specialty assigned to doctor successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async assignDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId, departmentId } = req.body;

            const result = await this.doctorAssociationService.assignDepartmentToDoctor(doctorId, departmentId);

            res.status(201).json({ message: 'Department assigned to doctor successfully' });

        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDoctorSpecialties(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const specialties = await this.doctorAssociationService.getDoctorSpecialties(Number(doctorId));
            res.status(200).json(specialties);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDoctorDepartments(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const departments = await this.doctorAssociationService.getDoctorDepartments(Number(doctorId));
            res.status(200).json(departments);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDoctorsBySpecialty(req: Request, res: Response): Promise<void> {
        try {
            const { specialtyId } = req.params;
            const doctors = await this.doctorAssociationService.getDoctorsBySpecialty(Number(specialtyId));
            res.status(200).json(doctors);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDoctorsByDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { departmentId } = req.params;
            const doctors = await this.doctorAssociationService.getDoctorsByDepartment(Number(departmentId));
            res.status(200).json(doctors);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
