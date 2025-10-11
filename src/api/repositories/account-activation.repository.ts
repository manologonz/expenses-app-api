import { Prisma } from '../../../generated/prisma';
import prisma from '../../db';

class AccountActivationRepository {
    findActivationTokenByEmail(email: string) {
        return prisma.accountActivation.findFirst({ where: { email: email } });
    }

    createAccontActivationToken(data: Prisma.AccountActivationCreateInput) {
        return prisma.accountActivation.create({ data });
    }

    deleteActivationTokenByEmail(email: string) {
        return prisma.accountActivation.delete({ where: { email: email } });
    }
}

const accountActivationRepository = new AccountActivationRepository();

export default accountActivationRepository;
