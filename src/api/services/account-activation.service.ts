import dayjs from 'dayjs';
import { AccountActivation } from '../../../generated/prisma';
import accountActivationRepository from '../repositories/account-activation.repository';
import { ValidationResult } from '../../utils/types';

class AccountActivationService {
    getAccountActivationData(email: string) {
        return accountActivationRepository.findActivationTokenByEmail(email);
    }

    async validateAccountActivationToken(token: string, email: string) {
        const accountActivationData = await this.getAccountActivationData(email);
        const currentDate = dayjs();

        if (!accountActivationData) {
            return false;
        }

        if (accountActivationData.activationToken !== token) {
            return false;
        }

        const tokenExpirationDate = dayjs(accountActivationData.expiration);

        return currentDate.isBefore(tokenExpirationDate);
    }

    isActivationTokenValid(data: AccountActivation, enteredToken: string) {
        const currentDate = dayjs();
        const tokenExpiration = dayjs(data.expiration);

        return enteredToken === data.activationToken && currentDate.isBefore(tokenExpiration);
    }
}

const accountActivationService = new AccountActivationService();

export default accountActivationService;
