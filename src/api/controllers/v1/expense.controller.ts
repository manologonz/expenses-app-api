import { Request, Response, NextFunction } from 'express';

export function createExpense(req: Request, res: Response, next: NextFunction) {
    return { message: 'create' };
}

export function updateExpense(req: Request, res: Response, next: NextFunction) {
    return { message: 'update' };
}

export function deleteExpense(req: Request, res: Response, next: NextFunction) {
    return { message: 'delete' };
}

export function udpateExpenseTags(req: Request, res: Response, next: NextFunction) {
    return { message: 'create' };
}

export function listExpenses(req: Request, res: Response, next: NextFunction) {
    return { message: 'list' };
}
