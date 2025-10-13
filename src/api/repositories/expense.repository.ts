import { Prisma } from '../../../generated/prisma';
import prisma from '../../db';

class ExpenseRepository {
    findAllExpenses(query: Prisma.ExpenseFindManyArgs) {
        return prisma.expense.findMany(query);
    }

    findUserExpenses(userId: number, query: Prisma.ExpenseWhereInput) {
        return prisma.expense.findMany({ where: { ...query, userId } });
    }

    findUserExpense(userId: number, expenseId: number) {
        return prisma.expense.findFirst({ where: { id: expenseId, userId } });
    }

    createExpense(data: Prisma.ExpenseCreateInput) {
        return prisma.expense.create({ data });
    }

    updateExpense(userId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
        return prisma.expense.update({ where: { userId, id: expenseId }, data });
    }

    deleteExpense(query: Prisma.ExpenseDeleteArgs) {
        return prisma.expense.delete(query);
    }
}

const expenseRepository = new ExpenseRepository();

export default expenseRepository;
