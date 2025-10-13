import { Request, Response, NextFunction } from 'express';
import { HttpError, UserLean } from '../../../utils/types';
import expenseService from '../../services/expense.service';

export async function createExpense(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = req.state?.user as UserLean;

    const { tags, ...data } = req.body;

    const newExpense = await expenseService.createUserExpense(authenticatedUser.id, tags, data);

    res.status(200).json({ detail: 'Expense created', data: newExpense });
}

export async function updateExpense(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = req.state?.user as UserLean;
    const expenseId = req.params.expenseId;
    const requestError = new HttpError({ message: "Couldn't update expense", statusCode: 400 });

    if (!req.body.amount && !req.body.description) {
        res.status(200).json({ detail: 'Nothing to update' });
        return;
    }

    if (!expenseId) {
        throw requestError;
    }

    const updatedExpense = await expenseService.updateUserExpense(authenticatedUser.id, parseInt(expenseId), req.body);

    res.status(200).json({ detail: 'Expense updated', data: updatedExpense });
}

export async function getExpense(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = req.state?.user as UserLean;
    const expenseId = req.params.expenseId;
    const requestError = new HttpError({ message: 'Invalid expense identifier', statusCode: 400 });

    if (!expenseId) {
        throw requestError;
    }

    const expense = await expenseService.getUserExpense(authenticatedUser.id, parseInt(expenseId));

    if (!expense) {
        requestError.message = 'Expense not found';
        requestError.statusCode = 404;
        throw requestError;
    }

    res.status(200).json({ data: expense });
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = req.state?.user as UserLean;
    const expenseId = req.params.expenseId;
    const requestError = new HttpError({ message: 'Invalid expense identifier', statusCode: 400 });

    if (!expenseId) {
        throw requestError;
    }

    const deletedExpense = await expenseService.deleteUserExpense(authenticatedUser.id, parseInt(expenseId));

    res.status(200).json({ detail: 'Expense deleted', data: deletedExpense });
}

export async function updateExpenseTags(req: Request, res: Response, next: NextFunction) {
    const authenticatedUser = req.state?.user as UserLean;
    const expenseId = req.params.expenseId;
    const requestError = new HttpError({ message: "Couldn't update expense", statusCode: 400 });

    if (!expenseId) {
        throw requestError;
    }

    const updatedExpense = await expenseService.updateUserExpenseTags(
        authenticatedUser.id,
        parseInt(expenseId),
        req.body.tags,
    );

    res.status(200).json({ detail: 'Expense updated', data: updatedExpense });
}

export function listExpenses(req: Request, res: Response, next: NextFunction) {
    return { message: 'list' };
}
