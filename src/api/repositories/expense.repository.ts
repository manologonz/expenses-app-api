import { Prisma } from '../../../generated/prisma';
import prisma from '../../db';

class ExpenseRepository {
    findAllExpenses(query: Prisma.ExpenseFindManyArgs) {
        return prisma.expense.findMany(query);
    }

    findUserExpenses(userId: number) {
        return prisma.expense.findMany({ where: { userId } });
    }

    createExpense(data: Prisma.ExpenseCreateInput) {
        return prisma.expense.create({ data });
    }

    updateExpense(userId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
        return prisma.expense.update({ where: { userId, id: expenseId }, data });
    }

    deleteExpense(userId: number, expenseId: number) {
        return prisma.expense.delete({ where: { userId, id: expenseId } });
    }
}

const expenseRepository = new ExpenseRepository();

export default expenseRepository;
