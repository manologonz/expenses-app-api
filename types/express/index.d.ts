import { UserLean } from '../../src/utils/types';
declare global {
    namespace Express {
        interface Request {
            state: {
                user?: UserLean;
            };
        }
    }
}

export {};
