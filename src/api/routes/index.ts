import { Router } from 'express';
import RAuthV1 from './v1/auth.routes';
import RUserV1 from './v1/user.routes';
import RExpenseV1 from './v1/expense.routes';

const router = Router();

router.use('/v1', RAuthV1);
router.use('/v1', RUserV1);
router.use('/v1', RExpenseV1);

export default router;
