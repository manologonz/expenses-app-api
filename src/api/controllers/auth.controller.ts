import type { Request, Response, NextFunction } from 'express';
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(400).json({ detail: 'login' });
    } catch (error) {
        next(error);
        return;
    }
}
