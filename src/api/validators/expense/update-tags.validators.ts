import { checkSchema } from 'express-validator';
import { arrayMessage, intMessage } from '../messages';

export default checkSchema({
    tags: {
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
