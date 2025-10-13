import { Request, Response, NextFunction } from 'express';
import { PaginationOpts } from './types';
class Pagination {
    page = '1';
    limit: string;

    constructor(limit?: number) {
        this.limit = limit?.toString() || '10';
    }

    middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            req.pagination = {
                page: (req.query?.page as string) || this.page,
                limit: (req.query?.limit as string) || this.limit,
            };
            next();
        };
    }

    parse(req: Request) {
        const page = req.pagination?.page ? Number(req.pagination.page.toString()) : Number(this.page);
        const limit = req.pagination?.limit ? Number(req.pagination.limit.toString()) : Number(this.limit);
        return {
            page,
            limit,
            skip: page === 1 ? 0 : page * limit,
        };
    }

    response<T>(values: { pagination: PaginationOpts; count: number; data: T[] }) {
        const pageCount = Math.ceil(values.count / values.pagination.limit);

        const hasMore = values.pagination.page + 1 < pageCount;

        return {
            count: values.count,
            hasMore,
            data: values.data,
        };
    }
}

export default Pagination;
