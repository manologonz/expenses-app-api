import express from 'express';
import { login } from '../../controllers/v1/auth.controller';
import userService from '../../services/user.service';

const router = express.Router();
const prefix = '/auth';

router.post(`${prefix}/login`, userService.loginValidator, login);

export default router;
