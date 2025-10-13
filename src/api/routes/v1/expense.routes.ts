import express from 'express';
import {
    createExpense,
    deleteExpense,
    getExpense,
    listExpenses,
    updateExpense,
    updateExpenseTags,
} from '../../controllers/v1/expense.controller';
import { authenticated } from '../../../utils/middlewares';
import expenseService from '../../services/expense.service';

const expensePermissions = [authenticated];

const widthPagination = expensePermissions.concat([expenseService.pagination.middleware()]);

const expenseCreatePermissions = expensePermissions.concat([expenseService.expenseCreateValidator]);
const expenseUpdatePermissions = expensePermissions.concat([expenseService.expenseUpdateValidator]);
const expenseTagUpdatePermissions = expensePermissions.concat([expenseService.expenseTagUpdateValidator]);

const router = express.Router();
const prefix = '/expense';

router.post(`${prefix}`, expenseCreatePermissions, createExpense);
router.get(`${prefix}`, widthPagination, listExpenses);
router.put(`${prefix}/:expenseId`, expenseUpdatePermissions, updateExpense);
router.get(`${prefix}/:expenseId`, expensePermissions, getExpense);
router.delete(`${prefix}/:expenseId`, expensePermissions, deleteExpense);
router.put(`${prefix}/:expenseId/tags`, expenseTagUpdatePermissions, updateExpenseTags);

export default router;
