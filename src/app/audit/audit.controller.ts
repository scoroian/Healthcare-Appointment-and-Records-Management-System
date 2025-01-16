import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AuditService } from './audit.service';

@Service()
export class AuditController {
    constructor(private readonly auditService: AuditService) {}

    // Obtener todos los logs (solo admin)
    async getAllLogs(req: Request, res: Response): Promise<void> {
        try {
            const logs = await this.auditService.getAllLogs();
            res.status(200).json(logs);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    // Obtener logs por usuario
    async getLogsByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const logs = await this.auditService.getLogsByUser(Number(userId));
            res.status(200).json(logs);
        } catch (error: unknown) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
