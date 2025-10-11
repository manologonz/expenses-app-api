import { Request, Response, NextFunction } from 'express';

export function listTags(req: Request, res: Response, next: NextFunction) {
    return { message: 'list' };
}

export function createTag(req: Request, res: Response, next: NextFunction) {
    return { message: 'create' };
}

export function udpateTag(req: Request, res: Response, next: NextFunction) {
    return { message: 'udpate' };
}

export function deleteTag(req: Request, res: Response, next: NextFunction) {}
