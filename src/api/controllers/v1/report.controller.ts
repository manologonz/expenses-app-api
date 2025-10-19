import { Request, Response, NextFunction } from 'express';
import { getAuthenticatedUser } from '../../../utils/helpers';
import reportService from '../../services/report.service';
import { HttpError } from '../../../utils/types';
import { Report } from '../../../../generated/prisma';

export async function createReport(req: Request, res: Response, next: NextFunction) {
    const autheticatedUser = getAuthenticatedUser(req);
    const data = req.body;

    const createdReport = await reportService.createUserReport(autheticatedUser.id, data);

    res.status(200).json({ detail: 'Report created', data: createdReport });
}

export async function listReports(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const paginationQuery = reportService.pagination.parse(req);

    const paginatedReports = await reportService.getUserReportsPaginated(
        authenticatedUser.id,
        req.query as any,
        paginationQuery,
    );

    const response = reportService.pagination.response<Report>({
        pagination: paginationQuery,
        ...paginatedReports,
    });

    res.status(200).json(response);
}

export async function getReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    const report = await reportService.getUserReportById(authenticatedUser.id, reportId);

    if (!report) {
        requestError.message = 'Report not found';
        requestError.statusCode = 404;
        throw requestError;
    }

    res.status(200).json({ data: report });
}

export async function updateReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const data = req.body;
    const reportId = parseInt(req.params.reportId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    if (!data?.name && !data?.startDate && !data?.endDate) {
        res.status(200).json({ detail: 'Nothing to update' });
        return;
    }

    const updatedReport = await reportService.updateReport(authenticatedUser.id, reportId, data);

    res.status(200).json({ detail: 'update report', data: updatedReport });
}

export async function deleteReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    const deletedReport = await reportService.deleteReport(authenticatedUser.id, reportId);

    res.status(200).json({ detail: 'Report deleted', data: deletedReport });
}

export async function addExpenseToReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const expenseId = parseInt(req.params.expenseId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    if (!expenseId && Number.isNaN(expenseId)) {
        requestError.message = 'Invalid expense identifier';
        throw requestError;
    }

    const updateResult = await reportService.addExpenseToReport(authenticatedUser.id, reportId, expenseId);

    res.status(200).json({ detail: 'expense to report', data: updateResult });
}

export async function removeExpenseFromReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const expenseId = parseInt(req.params.expenseId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    if (!expenseId && Number.isNaN(expenseId)) {
        requestError.message = 'Invalid expense identifier';
        throw requestError;
    }

    const updateResult = await reportService.removeExpenseFromReport(authenticatedUser.id, reportId, expenseId);

    res.status(200).json({ detail: 'expense to report', data: updateResult });
}

export async function addExpenseBatchToReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    const expenses = req.body.expenses;

    const updateResult = await reportService.batchAddExpensesToReport(authenticatedUser.id, reportId, expenses);

    res.status(200).json({ detail: 'Report updated', data: updateResult });
}

export async function removeExpenseBatchFromReport(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = getAuthenticatedUser(req);
    const reportId = parseInt(req.params.reportId);
    const requestError = new HttpError({ message: 'Invalid report identifier', statusCode: 400 });

    if (!reportId && Number.isNaN(reportId)) {
        throw requestError;
    }

    const expensesToLink = req.body.expenses;

    const updateResult = await reportService.batchRemoveExpensesToReport(
        authenticatedUser.id,
        reportId,
        expensesToLink,
    );

    res.status(200).json({ detail: 'Report updated', data: updateResult });
}
