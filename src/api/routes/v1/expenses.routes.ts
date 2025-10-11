import express from 'express';

const router = express.Router();
const prefix = '/v1/auth';

router.post(`${prefix}/login`);

export default router;
