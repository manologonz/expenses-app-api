import { Request, Response } from 'express';
import { HttpError, UserLean } from '../../../utils/types';
import tagService from '../../services/tag.service';
import { Tag } from '../../../../generated/prisma';

export async function listTags(req: Request, res: Response) {
    const authenticatedUser = req.state?.user as UserLean;
    const paginationQuery = tagService.pagination.parse(req);

    const tagData = await tagService.getAllUserTags(authenticatedUser.id, req.query as any, paginationQuery);

    const response = tagService.pagination.response<Tag>({
        pagination: paginationQuery,
        ...tagData,
    });

    res.status(200).json(response);
}

export async function createTag(req: Request, res: Response) {
    const authenticatedUser = req.state?.user as UserLean;
    const data = {
        name: req.body.name,
        slug: req.body.name,
        color: req.body.color || null,
    };

    const newTag = await tagService.createUserTag(authenticatedUser.id, data, req.body.parent);

    res.status(200).json({ detail: 'Tag created', data: newTag });
}

export async function udpateTag(req: Request, res: Response) {
    const tagId = req.params.tagId;
    const authenticatedUser = req.state?.user as UserLean;
    const requestError = new HttpError({ message: 'Invalid tag identifier', statusCode: 400 });

    if (!tagId) {
        throw requestError;
    }

    const data = {
        name: req.body.name,
        slug: req.body.name,
        color: req.body.color,
    };

    const updatedTag = await tagService.updateUserTag(authenticatedUser.id, parseInt(tagId), data);

    res.status(200).json({ message: 'Tag updated', data: updatedTag });
}

export async function deleteTag(req: Request, res: Response) {
    const authenticatedUser = req.state?.user as UserLean;
    const tagId = req.params.tagId;
    const requestError = new HttpError({ message: 'Invalid tag identifier', statusCode: 400 });

    if (!tagId) {
        throw requestError;
    }

    const deletedTag = await tagService.deleteUserTag(authenticatedUser.id, parseInt(tagId));

    res.status(200).json({ detail: 'Tag deleted', data: deletedTag });
}

export async function getTag(req: Request, res: Response) {
    const authenticatedUser = req.state?.user as UserLean;
    const tagId = req.params.tagId;
    const requestError = new HttpError({ message: 'Invalid tag identifier', statusCode: 400 });

    if (!tagId) {
        throw requestError;
    }

    const tag = await tagService.getUserTagById(authenticatedUser.id, parseInt(tagId));

    if (!tag) {
        requestError.message = 'Tag not found';
        requestError.statusCode = 404;
        throw requestError;
    }

    res.status(200).json({ data: tag });
}
