import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import validateResource from '../../middleware/validateResource.js';
import { authLoginSchema, authSignupSchema } from './auth.schema.js';
import { loginUser, signupUser, getSignedUser, logoutUser, refreshToken } from './auth.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', validateResource(authSignupSchema), asyncHandler(signupUser));
router.post('/login', validateResource(authLoginSchema), asyncHandler(loginUser));
router.get('/me', authenticate, asyncHandler(getSignedUser));
router.post('/logout', authenticate, asyncHandler(logoutUser));
router.post('/refresh', authenticate, asyncHandler(refreshToken));

export default router;
