import { checkSchema, CustomValidator } from 'express-validator';
import { hexColorMessage, requiredMessage } from '../messages';
import tagService from '../../services/tag.service';
import { UserLean, HttpError } from '../../../utils/types';

// TODO: refactor: avoid validator duplicates ref: uniqueTagSlug
export const uniqueTagSlug: CustomValidator = async (input, { req }) => {
    const slug = tagService.slugify(input);
    const user = req.state?.user as UserLean;
    const exists = await tagService.getUserTagCountBySlug(user.id, slug, parseInt(req.params?.tagId));

    if (exists) {
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
            errorMessage: requiredMessage('name'),
        },
        custom: {
            errorMessage: 'Tag already exits',
            options: uniqueTagSlug,
        },
    },
    color: {
        optional: true,
        exists: {
            errorMessage: requiredMessage('color'),
        },
        isHexColor: {
            errorMessage: hexColorMessage('color'),
        },
    },
});
