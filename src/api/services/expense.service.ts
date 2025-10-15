import { Request, Response, NextFunction } from 'express';
import { validateRequestBody } from '../../utils/helpers';
import Pagination from '../../utils/pagination';
import createExpenseValidator from '../validators/expense/create-expense.validator';
import { Prisma } from '../../../generated/prisma';
import expenseRepository from '../repositories/expense.repository';
import tagRepository from '../repositories/tag.repository';
import { HttpError, ModelFindOpts, PaginationOpts } from '../../utils/types';
import updateExpenseValidators from '../validators/expense/update-expense.validators';
import udpateExpenseTagsValidators from '../validators/expense/update-tags.validators';
import { BaseService } from './base-service.service';

class ExpenseService extends BaseService {
    pagination: Pagination;

    constructor() {
        super(['name'], ['tags'], ['name', 'id']);
        this.pagination = new Pagination();
    }

    async getUserExpenses(userId: number, findOpts: ModelFindOpts, pagination: PaginationOpts) {
        const query: Prisma.ExpenseFindManyArgs = {};
        query.where = { userId };

        if (findOpts.search) {
            query.where.OR = this.searchOnFields.map((field) => {
                return {
                    [field]: {
                        contains: findOpts.search,
                        mode: 'insensitive', // ← Add this for case-insensitive
                    },
                };
            });
        }

        const filter = this.parseFindOpts(findOpts.filter);

        if (filter) {
            query.where = {
                ...query.where,
                [filter.field]: filter.value,
            };
        }

        if (findOpts.sort) {
            const sortOpts = this.parseFindOpts(findOpts.sort);
            if (sortOpts && this.sortableFields.includes(sortOpts.field)) {
                const direction = sortOpts.value.toLowerCase();
                if (direction === 'asc' || direction === 'desc') {
                    query.orderBy = {
                        [sortOpts.field]: direction,
                    };
                }
            }
        }

        const count = await expenseRepository.expensesCount(query as Prisma.ExpenseCountArgs);

        query.skip = pagination.skip;
        query.take = pagination.limit;

        const data = await expenseRepository.findAllExpenses(query);

        return {
            count,
            data,
        };
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
        let connectedTags: Prisma.TagsOnPostsWhereUniqueInput[] = [];

        const expense = await this.getUserExpense(userId, expenseId);

        if (!expense) {
            throw new HttpError({ message: "Couldn't update expense", statusCode: 404 });
        }

        if (tags) {
            connectedTags = (await tagRepository.findUserTagsById(userId, tags)).map((tag) => ({
                id: tag.id,
            }));
        }

        return expenseRepository.updateUserExpense(userId, expenseId, { tags: { set: connectedTags } });
    }

    async createUserExpense(userId: number, tags: number[], data: Prisma.ExpenseCreateInput) {
        let connectedTags: Prisma.TagsOnPostsWhereUniqueInput[] = [];

        if (tags) {
            connectedTags = (await tagRepository.findUserTagsById(userId, tags)).map((tag) => ({
                id: tag.id,
            }));
        }

        console.log(connectedTags);

        return expenseRepository.createExpense({
            ...data,
            tags: { connect: connectedTags }, // TODO: Fix error when adding tags on creation
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
