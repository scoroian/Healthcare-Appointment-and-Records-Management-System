import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar roles.
 * @param roles Roles permitidos para acceder al recurso.
 */
export function authorizeRoles(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user; // Usuario extraído del token JWT

        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden: Access is denied' });
        }

        next();
    };
}