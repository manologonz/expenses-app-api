import { Router } from 'express';
import RAuthV1 from './v1/auth.routes';

const router = Router();

router.use(RAuthV1);

export default router;
