import express from 'express';
import {
    createExpense,
    deleteExpense,
    listExpenses,
    updateExpense,
    updateExpenseTags,
} from '../../controllers/v1/expense.controller';
import { authenticated, isAccountOwner } from '../../../utils/middlewares';

const expensePermissions = [authenticated];

const ownershipPermissions = expensePermissions.concat([isAccountOwner]);

const router = express.Router();
const prefix = '/expense';

router.post(`${prefix}`, expensePermissions, createExpense);
router.get(`${prefix}`, expensePermissions, listExpenses);
router.put(`${prefix}/:expenseId`, ownershipPermissions, updateExpense);
router.delete(`${prefix}/:expenseId`, ownershipPermissions, deleteExpense);
router.put(`${prefix}/:expenseId/tags`, ownershipPermissions, updateExpenseTags);

export default router;
