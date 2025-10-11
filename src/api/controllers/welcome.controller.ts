import type { Request, Response, NextFunction } from 'express';

export async function welcome(req: Request, res: Response, next: NextFunction) {
    try {
        res.json({ message: 'Welcome' });
    } catch (error) {
        next(error);
    }
}
