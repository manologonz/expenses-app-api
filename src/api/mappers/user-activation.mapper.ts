import { AccountActivation } from '../../../generated/prisma';
import { AccountActivationLean } from '../../utils/types';

export default class AccountActivationMapper {
    toLeanModel(data: AccountActivation): AccountActivationLean {
        return {
            email: data.email,
            activationToken: data.activationToken,
            expiration: data.expiration,
            role: data.role,
        };
    }
}
