import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export function checkHealth() {
    return prisma.$connect();
}

export default prisma;
