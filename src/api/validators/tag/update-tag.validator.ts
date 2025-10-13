import { checkSchema } from 'express-validator';
import { hexColorMessage, requiredMessage } from '../messages';

export default checkSchema({
    name: {
        exists: {
            errorMessage: requiredMessage('name'),
        },
        isString: {
            errorMessage: requiredMessage('name'),
        },
    },
    color: {
        exists: {
            errorMessage: requiredMessage('name'),
        },
        isHexColor: {
            errorMessage: hexColorMessage('color'),
        },
    },
});
