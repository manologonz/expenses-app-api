import express from 'express';
import {
    addExpenseBachToReport,
    addExpenseToReport,
    createReport,
    deleteReport,
    getReport,
    listReports,
    updateReports,
} from '../../controllers/v1/report.controller';
import { authenticated } from '../../../utils/middlewares';
import reportService from '../../services/report.service';

const router = express.Router();

const reportPermissions = [authenticated];

const reportCreatePermissions = reportPermissions.concat([reportService.reportCreateValidators]);
const reportUpdatePermissions = reportPermissions.concat([reportService.reportUpdateValidators]);
const reportBatchCreatePermissions = reportPermissions.concat([reportService.reportBatchCreateValidators]);

const prefix = '/report';

router.post(`${prefix}`, reportCreatePermissions, createReport);
router.get(`${prefix}`, listReports);
router.put(`${prefix}/:reportId`, reportUpdatePermissions, updateReports);
router.get(`${prefix}/:reportId`, getReport);
router.delete(`${prefix}/:reportId`, deleteReport);
router.post(`${prefix}/:reportId/expense/:expenseId`, addExpenseToReport);
router.post(`${prefix}/:reportId/expenses`, reportBatchCreatePermissions, addExpenseBachToReport);
