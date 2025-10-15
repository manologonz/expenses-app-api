import express from 'express';
import { authenticated } from '../../../utils/middlewares';
import tagService from '../../services/tag.service';
import { createTag, deleteTag, getTag, listTags, udpateTag } from '../../controllers/v1/tag.controller';

const router = express.Router();

const tagPermissions = [authenticated];

const tagCreatePermissions = tagPermissions.concat([tagService.tagCreateValidators]);
const tagUpdatePermissions = tagPermissions.concat([tagService.tagUpdateValidators]);
const withPagination = tagPermissions.concat([tagService.pagination.middleware()]);

const prefix = '/tag';

router.post(`${prefix}`, tagCreatePermissions, createTag);
router.get(`${prefix}`, withPagination, listTags);
router.put(`${prefix}/:tagId`, tagUpdatePermissions, udpateTag);
router.delete(`${prefix}/:tagId`, tagPermissions, deleteTag);
router.get(`${prefix}/:tagId`, tagPermissions, getTag);

export default router;
