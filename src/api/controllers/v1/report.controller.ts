import { Request, Response, NextFunction } from 'express';

export async function createReport(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'create report' });
}

export async function listReports(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'list reports' });
}

export async function getReport(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'get report' });
}

export async function updateReports(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'update report' });
}

export async function deleteReport(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'delete report' });
}

export async function addExpenseToReport(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'expense to report' });
}

export async function addExpenseBachToReport(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ detail: 'batch expense to report' });
}
