import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import validateResource from '../../middleware/validateResource.js';
import { authLoginSchema, authSignupSchema } from './auth.schema.js';
import { loginUser, signupUser } from './auth.controller.js';

const router = Router();

router.post('/signup', validateResource(authSignupSchema), asyncHandler(signupUser));
router.post('/login', validateResource(authLoginSchema), asyncHandler(loginUser));

export default router;
