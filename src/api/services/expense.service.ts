import { Request, Response, NextFunction } from 'express';
import { validateRequestBody } from '../../utils/helpers';
import Pagination from '../../utils/pagination';
import createExpenseValidator from '../validators/expense/create-expense.validator';
import { Expense, Prisma, Tag } from '../../../generated/prisma';
import expenseRepository from '../repositories/expense.repository';
import tagRepository from '../repositories/tag.repository';
import { ExpenseQueryArgs, HttpError, PaginationQuery } from '../../utils/types';
import updateExpenseValidators from '../validators/expense/update-expense.validators';
import udpateExpenseTagsValidators from '../validators/expense/update-tags.validators';
import { BaseService } from './base-service.service';

class ExpenseService extends BaseService {
    pagination: Pagination;

    constructor() {
        super(['name'], ['tags', 'date', 'reportId'], ['name', 'id']);
        this.pagination = new Pagination();
    }

    async getUserExpenses(userId: number, expenseQueryArgs: ExpenseQueryArgs, pagination: PaginationQuery) {
        let whereQuery: Prisma.ExpenseWhereInput = {};

        const searchQuery = this.parseSearchQuery<Prisma.ExpenseWhereInput>(expenseQueryArgs.search);
        const sortQuery = this.parseSortQuery(expenseQueryArgs.sort);
        const dateQuery = this.parseDateFilters(expenseQueryArgs.date);
        const singleRelationQuery = this.parseSingleRelationQuery(expenseQueryArgs.reportId);

        console.log(singleRelationQuery);

        if (singleRelationQuery) {
            whereQuery = {
                ...whereQuery,
                reportId: singleRelationQuery,
            };
        }

        if (searchQuery) {
            whereQuery = {
                ...whereQuery,
                OR: searchQuery,
            };
        }

        if (sortQuery) {
            whereQuery = {
                ...whereQuery,
                reportId: singleRelationQuery,
            };
        }

        if (dateQuery) {
            whereQuery = {
                ...whereQuery,
                date: dateQuery,
            };
        }

        whereQuery = {
            ...whereQuery,
            userId,
        };

        const count = await expenseRepository.expensesCount({ where: whereQuery });

        const data = await expenseRepository.findAllExpenses({
            where: whereQuery,
            skip: pagination.skip,
            take: pagination.limit,
            include: {
                tags: true,
            },
            orderBy: { [sortQuery.field]: sortQuery.value },
        });

        return {
            count,
            data,
        };
    }

    async getUserExpensesById(userId: number, expenses: number[]) {
        return expenseRepository.findUserExpenses(userId, { id: { in: expenses } });
    }

    async getUserExpense(userId: number, expenseId: number) {
        return expenseRepository.findUserExpense(userId, expenseId);
    }

    async updateUserExpense(userId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't update expense", statusCode: 404 });
        }

        return expenseRepository.updateUserExpense(userId, expenseId, data);
    }

    async updateUserExpenseTags(userId: number, expenseId: number, tags: number[]) {
        let connectedTags: Tag[] = [];

        const expenseToUpdate = await this.getUserExpense(userId, expenseId);

        if (!expenseToUpdate) {
            throw new HttpError({ message: "Couldn't update expense", statusCode: 404 });
        }

        connectedTags = await tagRepository.findUserTagsById(userId, tags);

        const expense = await expenseRepository.updateUserExpense(userId, expenseId, {
            tags: {
                set: connectedTags.map((tag) => ({
                    id: tag.id,
                })),
            },
        });

        return {
            expense,
            tags: connectedTags,
        };
    }

    async createUserExpense(userId: number, tags: number[], data: Prisma.ExpenseCreateInput) {
        const connectedTags: Tag[] = await tagRepository.findUserTagsById(userId, tags);

        return expenseRepository.createExpense({
            ...data,
            tags: {
                connect: connectedTags.map((tag) => ({
                    id: tag.id,
                })),
            },
            user: { connect: { id: userId } },
        });
    }

    async deleteUserExpense(userId: number, expenseId: number) {
        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't delete expense", statusCode: 404 });
        }

        return expenseRepository.deleteUserExpense(userId, expenseId);
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
