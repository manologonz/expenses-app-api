import express from 'express';
import { login } from '../../controllers/v1/auth.controller';
import { loginValidator } from '../../validators/auth.validator';

const router = express.Router();
const prefix = '/v1/auth';

router.post(`${prefix}/login`, loginValidator, login);

export default router;
