import { Service } from 'typedi';
import { Request, Response } from 'express';
import { DepartmentService } from './department.service';
import { logAuditAction } from '../middleware/middleware.audit';

@Service()
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    async createDepartment(req: Request, res: Response): Promise<void> {
        try {
            const department = req.body;
            const result = await this.departmentService.createDepartment(department);

            // Registrar auditoría
            await logAuditAction(req, 'CREATE', 'Department', result);

            res.status(201).json({ message: 'Department created successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllDepartments(req: Request, res: Response): Promise<void> {
        try {
            const departments = await this.departmentService.getAllDepartments();
            res.status(200).json(departments);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDepartmentById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const department = await this.departmentService.getDepartmentById(Number(id));

            if (department) {
                res.status(200).json(department);
            } else {
                res.status(404).json({ message: 'Department not found' });
            }
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const department = await this.departmentService.getDepartmentById(Number(id));
            if (!department) {
                res.status(404).json({ message: 'Department not found' });
            }

            await this.departmentService.updateDepartment(Number(id), updates);

            // Registrar auditoría
            await logAuditAction(req, 'UPDATE', 'Department', Number(id));

            res.status(200).json({ message: 'Department updated successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const department = await this.departmentService.getDepartmentById(Number(id));
            if (!department) {
                res.status(404).json({ message: 'Department not found' });
            }

            await this.departmentService.deleteDepartment(Number(id));

            // Registrar auditoría
            await logAuditAction(req, 'DELETE', 'Department', Number(id));

            res.status(200).json({ message: 'Department deleted successfully' });
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
