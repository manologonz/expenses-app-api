import { checkSchema, CustomValidator } from 'express-validator';
import { hexColorMessage, requiredMessage } from '../messages';
import { HttpError, UserLean } from '../../../utils/types';
import tagService from '../../services/tag.service';

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
});
