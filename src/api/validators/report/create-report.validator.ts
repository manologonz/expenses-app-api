import { checkSchema, CustomValidator } from 'express-validator';
import { dateMessage, requiredMessage, stringMessage } from '../messages';
import { HttpError } from '../../../utils/types';
import dayjs from 'dayjs';

const isFutureDate: CustomValidator = (input, { req }) => {
    const startDate = dayjs(req.body.startDate);
    const endDate = dayjs(input);

    const isAfterStart = endDate.isAfter(startDate);

    if (!isAfterStart) {
        throw new HttpError({ message: 'Tag already exists', statusCode: 400 });
    }

    return true;
};

export default checkSchema({
    name: {
        exists: {
            errorMessage: requiredMessage('name'),
            bail: true,
        },
        isString: {
            errorMessage: stringMessage('name'),
            bail: true,
        },
    },
    startDate: {
        exists: {
            errorMessage: requiredMessage('startDate'),
            bail: true,
        },
        isDate: {
            errorMessage: dateMessage('startDate'),
            bail: true,
        },
    },
    endDate: {
        exists: {
            errorMessage: requiredMessage('endDate'),
            bail: true,
        },
        isDate: {
            errorMessage: dateMessage('endDate'),
            bail: true,
        },
        custom: {
            errorMessage: 'endDate must be after start date',
            options: isFutureDate,
            bail: true,
        },
    },
});
