import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AuditService } from '../audit/audit.service';

export async function logAuditAction(
    req: Request,
    action: string,
    resource: string,
    resourceId?: number
): Promise<void> {
    const auditService = Container.get(AuditService);
    await auditService.logAction(req, action, resource, resourceId);
}

export function auditMiddleware(action: string, resource: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const resourceId = req.params.id ? Number(req.params.id) : undefined;

            await logAuditAction(userId, action, resource, resourceId);
            next();
        } catch (error) {
            console.error('Failed to log audit action:', error);
            next();
        }
    };
}
