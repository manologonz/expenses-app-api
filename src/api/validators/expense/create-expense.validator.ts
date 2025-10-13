import { checkSchema } from 'express-validator';
import { arrayMessage, dateMessage, floatMessage, intMessage, requiredMessage } from '../messages';

export default checkSchema({
    description: {
        exists: {
            errorMessage: requiredMessage('description'),
        },
        isString: {
            errorMessage: requiredMessage('description'),
        },
    },
    amount: {
        exists: {
            errorMessage: requiredMessage('amount'),
        },
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
    tags: {
        optional: true,
        isArray: {
            errorMessage: arrayMessage('tags'),
        },
    },
    'tags.*': {
        isInt: {
            errorMessage: intMessage('tag'),
        },
    },
});
