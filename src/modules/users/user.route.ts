import { Router } from 'express';
import {
	createUserSchema,
	updateUserPasswordSchema,
	updateUserProfileSchema,
	updateUserSchema,
} from './user.schema.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	restoreUser,
	updateUser,
	updateUserPassword,
	updateUserProfile,
} from './user.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireAuthAndValidate } from '../../middleware/middlewareUtils.js';

const router = Router();

router.get(
	'/', 
	authenticate, 
	asyncHandler(getUsers)
);

router.get(
	'/:id', 
	authenticate, 
	asyncHandler(getUserById)
);

router.post(
	'/',
	requireAuthAndValidate(createUserSchema),
	asyncHandler(createUser)
);

router.put(
	'/:id',
	requireAuthAndValidate(updateUserSchema),
	asyncHandler(updateUser)
);

router.put(
	'/:id/restore', 
	authenticate, 
	asyncHandler(restoreUser)
);

router.put(
	'/:id/update-profile',
	requireAuthAndValidate(updateUserProfileSchema),
	asyncHandler(updateUserProfile)
);

router.put(
	'/:id/change-password',
	requireAuthAndValidate(updateUserPasswordSchema),
	asyncHandler(updateUserPassword)
);

router.delete(
	'/:id', 
	authenticate, 
	asyncHandler(deleteUser)
);

export default router;
