import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response.js';
import AuthService from './auth.service.js';

/**
 * Sign up user
 *
 * @route POST /api/signup
 * @param {Request} req
 * @param {Response} res
 */
const signupUser = async (req: Request, res: Response) => {
	const user = await AuthService.signupUser(req.body);

	sendResponse(res, 201, 'success', 'User has successfully registered.', user);
}


/**
 * Login user
 * 
 * @route POST /api/login 
 * @param {Request} req
 * @param {Response} res
 * @returns {string} token
 */
const loginUser = async (req: Request, res: Response) => {
	const userData = await AuthService.loginUser(req.body);

	sendResponse(res, 200, 'success', 'Successfully logged in', userData);
}


/**
 * Get user info from cookie data
 *
 * @param {Request} req
 * @param {Response} res
 * @return {*} 
 */
const getSignedUser = async (req: Request, res: Response) => {
  const payload = req.user as any;
	const userId = payload.userId;

  // When no sub in token, you can still return the payload if trusted
  if (!payload) {
    return res.json({
      authenticated: true,
      user: payload,
      roles: payload?.roles ?? [],
    });
  }

  const user = await AuthService.getSignedUser(userId);

  return res.json({
    authenticated: true,
		user, 
		role: user?.role,
  });
}

export { signupUser, loginUser, getSignedUser };
