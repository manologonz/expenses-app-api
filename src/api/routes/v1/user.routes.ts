import express from 'express';
import { inviteUser, removeUser, updateUserActiveStatus, userRegistration } from '../../controllers/v1/user.controller';
import { authenticated, isAdmin } from '../../../utils/middlewares';
import userService from '../../services/user.service';

const router = express.Router();

const prefix = '/user';

const adminPremissions = [authenticated, isAdmin];

const invitePermissions = adminPremissions.concat([userService.inviteInputValidators]);

router.post(`${prefix}/register`, userService.userRegistrationValidators, userRegistration);
router.put(`${prefix}/:userId/activate`, adminPremissions, updateUserActiveStatus);
router.delete(`${prefix}/:userId`, adminPremissions, removeUser);
router.post(`${prefix}/invite`, invitePermissions, inviteUser);

export default router;
