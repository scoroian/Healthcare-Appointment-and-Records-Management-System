import { Request } from 'express';
import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';

@Service()
export class AuditService {
    constructor(private readonly databaseService: DatabaseService) {}

    public async logAction(req: Request, action: string, resource: string, resourceId?: number): Promise<void> {
        const userId = (req as any).user?.id; // Recuperar el ID del usuario logueado desde el token

        if (!userId) {
            console.error('Unable to log action: userId not found in request');
            return;
        }

        const query = {
            sql: `
            INSERT INTO audits (userId, action, resource, resourceId)
            VALUES (?, ?, ?, ?)
          `,
            params: [userId, action, resource, resourceId],
        };

        await this.databaseService.execQuery(query);
    }

    // Recuperar todos los logs
    public async getAllLogs(): Promise<any[]> {
        const query = { sql: `SELECT * FROM audits ORDER BY timestamp DESC` };
        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }

    // Recuperar logs por usuario
    public async getLogsByUser(userId: number): Promise<any[]> {
        const query = { sql: `SELECT * FROM audits WHERE userId = ? ORDER BY timestamp DESC`, params: [userId] };
        const result = await this.databaseService.execQuery(query);
        return result.rows;
    }
}
