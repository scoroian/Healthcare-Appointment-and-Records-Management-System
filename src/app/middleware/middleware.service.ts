import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { config } from '../../config/environment';
import {token} from "morgan";

export function authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.user_sessions.secret, (err: VerifyErrors | null, user: any) => {
            if (err) {
                console.log('JWT Error:', err.message);
                return res.sendStatus(403); // Forbidden
            }
            (req as any).user = user; // Adjuntar el usuario al objeto de la solicitud
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }

}
