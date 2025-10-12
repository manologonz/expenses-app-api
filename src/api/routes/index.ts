import { Router } from 'express';
import RAuthV1 from './v1/auth.routes';
import RUserV1 from './v1/user.routes';

const router = Router();

router.use('/v1', RAuthV1);
router.use('/v1', RUserV1);

export default router;
