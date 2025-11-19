import { checkSchema, CustomValidator } from 'express-validator';
import { hexColorMessage, intMessage, requiredMessage } from '../messages';
import { HttpError, UserLean } from '../../../utils/types';
import tagService from '../../services/tag.service';

// TODO: refactor: avoid validator duplicates ref: uniqueTagSlug
export const uniqueTagSlug: CustomValidator = async (input, { req }) => {
    const slug = tagService.slugify(input);
    const user = req.state?.user as UserLean;
    const exists = await tagService.getUserTagCountBySlug(user.id, slug);

    if (exists) {
        throw new HttpError({ message: 'Tag already exists', statusCode: 400 });
    }

    return true;
};

export default checkSchema({
    name: {
        exists: {
            errorMessage: requiredMessage('name'),
        },
        isString: {
            errorMessage: requiredMessage('name'),
        },
        custom: {
            errorMessage: 'Tag name already exists',
            options: uniqueTagSlug,
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
    parent: {
        optional: true,
        exists: {
            errorMessage: requiredMessage('parent'),
        },
        isInt: {
            errorMessage: intMessage('parent'),
        },
    },
});
