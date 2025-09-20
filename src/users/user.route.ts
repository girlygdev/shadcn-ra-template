import { Router } from 'express';
import validateResource from '../middleware/validateResource.js';
import { createUserSchema, updateUserPasswordSchema, updateUserProfileSchema, updateUserSchema } from './user.schema.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createUser, deleteUser, getUserById, getUsers, restoreUser, updateUser, updateUserPassword, updateUserProfile } from './user.controller.js';

const router = Router();

router.get('/', asyncHandler(getUsers));
router.get('/:id', asyncHandler(getUserById));
router.post('/', validateResource(createUserSchema), asyncHandler(createUser));
router.put('/:id', validateResource(updateUserSchema), asyncHandler(updateUser));
router.put('/:id/restore', asyncHandler(restoreUser));
router.delete('/:id', asyncHandler(deleteUser));
router.put('/api/users/:id/update-profile', validateResource(updateUserProfileSchema), asyncHandler(updateUserProfile));
router.put('/api/users/:id/change-password', validateResource(updateUserPasswordSchema), asyncHandler(updateUserPassword));

export default router;
