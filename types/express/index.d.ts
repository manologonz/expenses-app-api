import { UserLean } from '../../src/utils/types';
declare global {
    namespace Express {
        interface Request {
            state?: {
                user?: UserLean;
            };

            pagination?: {
                page: string;
                limit: string;
            };
        }
    }
}

export {};
