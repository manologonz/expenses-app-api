import { Request, Response, NextFunction } from 'express';
import { validateRequestBody } from '../../utils/helpers';
import Pagination from '../../utils/pagination';
import createExpenseValidator from '../validators/expense/create-expense.validator';
import { Prisma } from '../../../generated/prisma';
import expenseRepository from '../repositories/expense.repository';
import tagRepository from '../repositories/tag.repository';
import { HttpError } from '../../utils/types';
import updateExpenseValidators from '../validators/expense/update-expense.validators';
import udpateExpenseTagsValidators from '../validators/expense/update-tags.validators';
class ExpenseService {
    pagination: Pagination;

    constructor() {
        this.pagination = new Pagination();
    }

    async getUserExpenses(userId: number, query: Prisma.ExpenseWhereInput) {
        return expenseRepository.findUserExpenses(userId, query);
    }

    async getUserExpense(userId: number, expenseId: number) {
        return expenseRepository.findUserExpense(userId, expenseId);
    }

    async updateUserExpense(userId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't update expense", statusCode: 404 });
        }

        return expenseRepository.updateExpense(userId, expenseId, data);
    }

    async updateUserExpenseTags(userId: number, expenseId: number, tags: number[]) {
        let connectedTags: Prisma.TagsOnPostsWhereUniqueInput[] = [];

        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't update expense", statusCode: 404 });
        }

        if (tags) {
            connectedTags = (await tagRepository.findTagsById(tags)).map((tag) => ({
                id: tag.id,
            }));
        }

        return expenseRepository.updateExpense(userId, expenseId, { tags: { set: connectedTags } });
    }

    async createUserExpense(userId: number, tags: number[], data: Prisma.ExpenseCreateInput) {
        let connectedTags: Prisma.TagsOnPostsWhereUniqueInput[] = [];

        if (tags) {
            connectedTags = (await tagRepository.findTagsById(tags)).map((tag) => ({
                id: tag.id,
            }));
        }
        return expenseRepository.createExpense({
            ...data,
            tags: { connect: connectedTags },
            user: { connect: { id: userId } },
        });
    }

    async deleteUserExpense(userId: number, expenseId: number) {
        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't delete expense", statusCode: 404 });
        }

        return expenseRepository.deleteExpense({ where: { id: expenseId, userId: userId } });
    }

    async expenseCreateValidator(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, createExpenseValidator);
        next();
    }
    async expenseUpdateValidator(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, updateExpenseValidators);
        next();
    }
    async expenseTagUpdateValidator(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, udpateExpenseTagsValidators);
        next();
    }
}

const expenseService = new ExpenseService();

export default expenseService;
