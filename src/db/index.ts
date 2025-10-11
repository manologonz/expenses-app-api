import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export function databaseCheckHealth() {
    return prisma.$connect();
}

export default prisma;
