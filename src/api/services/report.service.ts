import { Request, Response, NextFunction } from 'express';
import { validateRequestBody } from '../../utils/helpers';
import createReportValidator from '../validators/report/create-report.validator';
import updateReportValidator from '../validators/report/update-report.validator';
import batchExpenseReportValidator from '../validators/report/batch-expense-report.validator';
import { Prisma } from '../../../generated/prisma';
import { BaseService } from './base-service.service';
import Pagination from '../../utils/pagination';
import reportRepository from '../repositories/report.repository';
import dayjs from 'dayjs';
import expenseService from './expense.service';
import { HttpError, PaginationQuery, ReportQueryArgs } from '../../utils/types';

class ReportService extends BaseService {
    pagination: Pagination;

    constructor() {
        super(['name'], [], ['name', 'id']);
        this.pagination = new Pagination();
    }

    async getUserReportsPaginated(userId: number, urlQuery: ReportQueryArgs, pagination: PaginationQuery) {
        let whereQuery: Prisma.ReportWhereInput = {};

        const startDateFilter = this.parseDateFilters(urlQuery.startDate);
        const endDateFilter = this.parseDateFilters(urlQuery.endDate);
        const sorting = this.parseSortQuery(urlQuery.sort);
        const searchQuery = this.parseSearchQuery<Prisma.ReportWhereInput>(urlQuery.search);

        if (startDateFilter) {
            whereQuery = {
                startDate: startDateFilter,
            };
        }

        if (endDateFilter) {
            whereQuery = {
                ...whereQuery,
                endDate: endDateFilter,
            };
        }

        if (searchQuery) {
            whereQuery = {
                ...whereQuery,
                OR: searchQuery,
            };
        }

        whereQuery = {
            ...whereQuery,
            userId,
        };

        const count = await reportRepository.countReports({ where: whereQuery });

        const data = await reportRepository.findReports({
            where: whereQuery,
            skip: pagination.skip,
            take: pagination.limit,

            orderBy: {
                [sorting.field]: sorting.value,
            },
        });

        return {
            count,
            data,
        };
    }

    getSearchQuery(search: string, query: Prisma.ReportWhereInput): Prisma.ReportWhereInput {
        let queryObj = { ...query };

        if (search) {
            queryObj = {
                ...queryObj,
                OR: this.searchOnFields.map((field) => {
                    return {
                        [field]: {
                            contains: search,
                            mode: 'insensitive', // ← Add this for case-insensitive
                        },
                    };
                }),
            };
        }

        return queryObj;
    }

    createUserReport(userId: number, data: Prisma.ReportCreateInput) {
        data.startDate = dayjs(data.startDate).toDate();
        data.endDate = dayjs(data.endDate).toDate();
        return reportRepository.createRepository({ ...data, user: { connect: { id: userId } } });
    }

    async updateReport(userId: number, reportId: number, data: Prisma.ReportUpdateInput) {
        const exists = await this.userReportExists(userId, reportId);

        if (!exists) {
            throw new HttpError({ message: "Couldn't update report", statusCode: 404 });
        }

        return reportRepository.updateReport({ where: { id: reportId, userId: userId }, data });
    }

    async addExpenseToReport(userId: number, reportId: number, expenseId: number) {
        const expense = await expenseService.getUserExpense(userId, expenseId);
        const existsRerport = await this.userReportExists(userId, reportId);

        if (!expense) {
            throw new HttpError({ message: 'Expense not found', statusCode: 404 });
        }

        if (!existsRerport) {
            throw new HttpError({ message: "Couldn't update report", statusCode: 404 });
        }

        const report = await reportRepository.updateReport({
            where: { id: reportId, userId },
            data: { expenses: { connect: [{ id: expenseId }] } },
        });

        return {
            report,
            expense,
        };
    }

    async removeExpenseFromReport(userId: number, reportId: number, expenseId: number) {
        const expense = await expenseService.getUserExpense(userId, expenseId);
        const existsRerport = await this.userReportExists(userId, reportId);

        if (!expense) {
            throw new HttpError({ message: 'Expense not found', statusCode: 404 });
        }

        if (!existsRerport) {
            throw new HttpError({ message: "Couldn't update report", statusCode: 404 });
        }

        const report = await reportRepository.updateReport({
            where: { id: reportId, userId },
            data: { expenses: { disconnect: [{ id: expenseId }] } },
        });

        return {
            report,
            expense,
        };
    }

    async batchAddExpensesToReport(userId: number, reportId: number, expenses: number[]) {
        const exists = await this.userReportExists(userId, reportId);

        if (!exists) {
            throw new HttpError({ message: "Couldn't update report", statusCode: 404 });
        }

        const expensesToConnect = await expenseService.getUserExpensesById(userId, expenses);

        const report = await reportRepository.updateReport({
            where: { id: reportId, userId },
            data: {
                expenses: {
                    connect: expensesToConnect.map((el) => ({
                        id: el.id,
                    })),
                },
            },
        });

        return {
            report,
            expenses: expensesToConnect,
        };
    }

    async batchRemoveExpensesToReport(userId: number, reportId: number, expenses: number[]) {
        const exists = await this.userReportExists(userId, reportId);

        if (!exists) {
            throw new HttpError({ message: "Couldn't update report", statusCode: 404 });
        }

        const expensesToDisconnect = await expenseService.getUserExpensesById(userId, expenses);

        const report = await reportRepository.updateReport({
            where: { id: reportId, userId },
            data: {
                expenses: {
                    disconnect: expensesToDisconnect.map((el) => ({
                        id: el.id,
                    })),
                },
            },
        });

        return {
            report,
            expenses: expensesToDisconnect,
        };
    }

    async deleteReport(userId: number, reportId: number) {
        const exists = await this.userReportExists(userId, reportId);

        if (!exists) {
            throw new HttpError({ message: "Couldn't delete report", statusCode: 404 });
        }

        return reportRepository.deleteReport({ where: { id: reportId, userId } });
    }

    getUserReportById(userId: number, reportId: number) {
        return reportRepository.findReport({ where: { id: reportId, userId } });
    }

    userReportExists(userId: number, reportId: number) {
        return reportRepository.countReports({ where: { id: reportId, userId } });
    }

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
