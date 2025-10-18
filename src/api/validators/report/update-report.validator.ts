import { checkSchema, CustomValidator } from 'express-validator';
import { requiredMessage, stringMessage } from '../messages';
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
        optional: true,
        exists: {
            errorMessage: requiredMessage('name'),
        },
        isString: {
            errorMessage: stringMessage('name'),
        },
    },
    startDate: {
        optional: true,
        exists: {
            errorMessage: requiredMessage('startDate'),
        },
        isString: {
            errorMessage: stringMessage('startDate'),
        },
    },
    endDate: {
        optional: true,
        exists: {
            errorMessage: requiredMessage('endDate'),
        },
        isString: {
            errorMessage: stringMessage('endDate'),
        },
        custom: {
            errorMessage: 'endDate must be after start date',
            options: isFutureDate,
        },
    },
});
