import express from 'express';
import { welcome } from '../controllers/welcome.controller';

const router = express.Router();
const prefix = '/welcome';

router.get(prefix, welcome);

export default router;
