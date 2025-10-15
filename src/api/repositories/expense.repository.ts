import { Prisma } from '../../../generated/prisma';
import prisma from '../../db';

class ExpenseRepository {
    findAllExpenses(query: Prisma.ExpenseFindManyArgs) {
        return prisma.expense.findMany(query);
    }

    findUserExpenses(userId: number, query: Prisma.ExpenseWhereInput) {
        return prisma.expense.findMany({ where: { ...query, userId } });
    }

    findAllTags(query: Prisma.ExpenseFindManyArgs) {
        return prisma.expense.findMany(query);
    }

    findUserExpense(userId: number, expenseId: number) {
        return prisma.expense.findFirst({ where: { id: expenseId, userId } });
    }

    createExpense(data: Prisma.ExpenseCreateInput) {
        return prisma.expense.create({ data });
    }

    expensesCount(query: Prisma.ExpenseCountArgs) {
        return prisma.expense.count(query);
    }

    updateUserExpense(userId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
        return prisma.expense.update({ where: { userId, id: expenseId }, data });
    }

    deleteUserExpense(userId: number, expenseId: number) {
        return prisma.expense.delete({ where: { id: expenseId, userId } });
    }
}

const expenseRepository = new ExpenseRepository();

export default expenseRepository;
