import express from 'express';
import { inviteUser, removeUser, updateUserActiveStatus, userRegistration } from '../../controllers/v1/user.controller';
import { authenticated, isAdmin } from '../../../utils/middlewares';

const router = express.Router();

const prefix = '/user';

const adminPremissions = [authenticated, isAdmin];

router.post(`${prefix}/register`, userRegistration);
router.put(`${prefix}/:userId/activate`, adminPremissions, updateUserActiveStatus);
router.delete(`${prefix}/:userId`, adminPremissions, removeUser);
router.post(`${prefix}/invite`, adminPremissions, inviteUser);

export default router;
