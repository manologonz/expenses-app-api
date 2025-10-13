import { checkSchema } from 'express-validator';
import { dateMessage, floatMessage, requiredMessage } from '../messages';

export default checkSchema({
    description: {
        optional: true,
        isString: {
            errorMessage: requiredMessage('description'),
        },
    },
    amount: {
        optional: true,
        isFloat: {
            errorMessage: floatMessage('amount'),
        },
    },
    date: {
        optional: true,
        isDate: {
            errorMessage: dateMessage('date'),
        },
    },
});
