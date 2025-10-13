import express from 'express';
import {
    inviteUser,
    listUser,
    removeUser,
    updateUserActiveStatus,
    userRegistration,
} from '../../controllers/v1/user.controller';
import { authenticated, isAdmin } from '../../../utils/middlewares';
import userService from '../../services/user.service';

const router = express.Router();

const prefix = '/user';

const adminPremissions = [authenticated, isAdmin];

const widthPagination = adminPremissions.concat([userService.pagination.middleware()]);

const invitePermissions = adminPremissions.concat([userService.inviteInputValidators]);

router.get(`${prefix}`, widthPagination, listUser);
router.post(`${prefix}/register`, userService.userRegistrationValidators, userRegistration);
router.put(`${prefix}/:userId/activate`, adminPremissions, updateUserActiveStatus);
router.delete(`${prefix}/:userId`, adminPremissions, removeUser);
router.post(`${prefix}/invite`, invitePermissions, inviteUser);

export default router;
