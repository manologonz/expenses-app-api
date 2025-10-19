import express from 'express';
import {
    addExpenseBatchToReport,
    addExpenseToReport,
    createReport,
    deleteReport,
    getReport,
    listReports,
    removeExpenseBatchFromReport,
    removeExpenseFromReport,
    updateReport,
} from '../../controllers/v1/report.controller';
import { authenticated } from '../../../utils/middlewares';
import reportService from '../../services/report.service';

const router = express.Router();

const reportPermissions = [authenticated];

const reportCreatePermissions = reportPermissions.concat([reportService.reportCreateValidators]);
const reportUpdatePermissions = reportPermissions.concat([reportService.reportUpdateValidators]);
const reportBatchCreatePermissions = reportPermissions.concat([reportService.reportBatchCreateValidators]);

const widthPagination = reportPermissions.concat([reportService.pagination.middleware()]);

const prefix = '/report';

router.get(`${prefix}`, widthPagination, listReports);
router.get(`${prefix}/:reportId`, reportPermissions, getReport);

router.post(`${prefix}`, reportCreatePermissions, createReport);
router.post(`${prefix}/:reportId/expenses`, reportBatchCreatePermissions, addExpenseBatchToReport);
router.post(`${prefix}/:reportId/expense/:expenseId`, reportPermissions, addExpenseToReport);

router.put(`${prefix}/:reportId`, reportUpdatePermissions, updateReport);

router.delete(`${prefix}/:reportId/expenses`, reportBatchCreatePermissions, removeExpenseBatchFromReport);
router.delete(`${prefix}/:reportId/expense/:expenseId`, reportPermissions, removeExpenseFromReport);
router.delete(`${prefix}/:reportId`, reportPermissions, deleteReport);

export default router;
