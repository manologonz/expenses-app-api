import { Request, Response, NextFunction } from 'express';
import { validateRequestBody } from '../../utils/helpers';
import createReportValidator from '../validators/report/create-report.validator';
import updateReportValidator from '../validators/report/update-report.validator';
import batchExpenseReportValidator from '../validators/report/batch-expense-report.validator';

class ReportService {
    async reportCreateValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, createReportValidator);
        next();
    }

    async reportBatchCreateValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, batchExpenseReportValidator);
        next();
    }

    async reportUpdateValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, updateReportValidator);
        next();
    }
}

const reportService = new ReportService();

export default reportService;
