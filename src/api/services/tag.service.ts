import { Prisma } from '../../../generated/prisma';
import { textToSlug, validateRequestBody } from '../../utils/helpers';
import tagRepository from '../repositories/tag.repository';
import createTagValidator from '../validators/tag/create-tag.validator';
import { Request, Response, NextFunction } from 'express';
import updateTagValidator from '../validators/tag/update-tag.validator';
import { HttpError, PaginationQuery, TagQueryArgs } from '../../utils/types';
import Pagination from '../../utils/pagination';
import { BaseService } from './base-service.service';

class TagService extends BaseService {
    pagination: Pagination;

    constructor() {
        super(['name'], [], ['name', 'id']);
        this.pagination = new Pagination();
    }

    async updateUserTag(userId: number, tagId: number, data: Prisma.TagUpdateInput) {
        const existingTag = await this.isTagCreated(userId, tagId);

        if (data.name) {
            const newSlug = this.slugify(data.name as string);
            const uniqueSlug = await this.getUserTagCountBySlug(userId, newSlug, tagId);

            if (uniqueSlug > 0) {
                throw new HttpError({ message: 'Tag already exists', statusCode: 400 });
            }

            data.slug = newSlug;
        }

        if (!existingTag) {
            throw new HttpError({ message: "Couldn't update tag", statusCode: 404 });
        }

        return tagRepository.updateUserTag(userId, tagId, data);
    }

    async getAllUserTags(userId: number, tagQueryArgs: TagQueryArgs, pagination: PaginationQuery) {
        let whereQuery: Prisma.TagWhereInput = {};

        if (tagQueryArgs?.depth !== 'all') {
            whereQuery.parent = { is: null };
        }

        const searchQuery = this.parseSearchQuery<Prisma.TagWhereInput>(tagQueryArgs.search);
        const sortQuery = this.parseSortQuery(tagQueryArgs.sort);

        if (searchQuery) {
            whereQuery = {
                ...whereQuery,
                OR: searchQuery,
            };
        }

        whereQuery = {
            ...whereQuery,
            userId,
        };

        const count = await tagRepository.countTags({ where: whereQuery });

        const data = await tagRepository.findAllTags({
            where: whereQuery,
            skip: pagination.skip,
            take: pagination.limit,
            orderBy: { [sortQuery.field]: sortQuery.value },
        });

        return {
            count,
            data,
        };
    }

    getUserTagBySlug(userId: number, slug: string) {
        return tagRepository.findUserTagBySlug(userId, slug);
    }

    getUserTagById(userId: number, tagId: number) {
        return tagRepository.findUserTag(userId, tagId);
    }

    async createUserTag(userId: number, data: Prisma.TagCreateInput, parentTag?: number) {
        const dataToSave: Prisma.TagCreateInput = {
            name: data.name,
            slug: this.slugify(data.slug),
            color: data.color,
            user: { connect: { id: userId } },
        };

        const parentError = new HttpError({ message: 'Parent tag not found', statusCode: 404 });

        if (parentTag) {
            const parentExists = await this.getUserTagById(userId, parentTag);

            if (!parentExists) {
                throw parentError;
            }

            if (parentExists.parentId) {
                parentError.message = 'Parent exceeded children depth';
                parentError.statusCode = 400;

                throw parentError;
            }

            dataToSave.parent = { connect: { id: parentTag } };
        }

        return tagRepository.createTag(dataToSave);
    }

    getUserTagCountBySlug(userId: number, slug: string, sameId?: number) {
        const query: Prisma.TagCountArgs = { where: { userId, slug: slug } };

        if (sameId) {
            query.where = { ...query.where, id: { not: sameId } };
        }

        return tagRepository.countTags(query);
    }

    async isTagCreated(userId: number, tagId: number) {
        const query: Prisma.TagCountArgs = { where: { userId, id: tagId } };

        const count = await tagRepository.countTags(query);

        return count > 0;
    }

    slugify(word: string) {
        return textToSlug(word);
    }

    async tagCreateValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, createTagValidator);
        next();
    }

    async tagUpdateValidators(req: Request, res: Response, next: NextFunction) {
        await validateRequestBody(req, updateTagValidator);
        next();
    }

    deleteUserTag(userId: number, tagId: number) {
        return tagRepository.deleteUserTag(userId, tagId);
    }
}

const tagService = new TagService();

export default tagService;
