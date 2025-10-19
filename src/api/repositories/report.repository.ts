import { Prisma } from '../../../generated/prisma';
import prisma from '../../db';

class ReportRepository {
    findReports(query: Prisma.ReportFindManyArgs) {
        return prisma.report.findMany(query);
    }

    createRepository(data: Prisma.ReportCreateInput) {
        return prisma.report.create({ data });
    }

    updateReport(query: Prisma.ReportUpdateArgs) {
        return prisma.report.update(query);
    }

    deleteReport(query: Prisma.ReportDeleteArgs) {
        return prisma.report.delete(query);
    }

    findReport(query: Prisma.ReportFindFirstArgs) {
        return prisma.report.findFirst(query);
    }

    countReports(query: Prisma.ReportCountArgs) {
        return prisma.report.count(query);
    }
}

const reportRepository = new ReportRepository();

export default reportRepository;
