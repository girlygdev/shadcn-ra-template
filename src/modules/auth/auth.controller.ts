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
 * Login user and send cookie on request
 * 
 * @route POST /api/login 
 * @param {Request} req
 * @param {Response} res
 * @returns {string} token
 */
const loginUser = async (req: Request, res: Response) => { 
	const userData  = await AuthService.loginUser(req.body);
	const { user, token } = userData;

	res.cookie('auth', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 86400000, // 1 day
		path: '/',
	});

	return sendResponse(res, 200, 'success', 'Successfully logged in');
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

/**
 * Logout user and clear request auth
 *
 * @param {Request} req
 * @param {Response} res
 * @return {*} 
 */
const logoutUser = async (req: Request, res: Response) => {
	res.clearCookie('auth', {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: 'strict',
		path: '/'
	})

	return sendResponse(res, 200, 'success', 'Successfully logged out');
}


const refreshToken = async (req: Request, res: Response) => {
	const oldToken = req.cookies.auth;

	if (!oldToken) {
		return sendResponse(res, 401, 'error', 'No token provided');
	}

	try {
		const userData = await AuthService.refreshToken(oldToken);
		const { user, token } = userData;

		res.cookie('auth', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: 'strict',
			path: '/'
		})

		return sendResponse(res, 200, 'success', 'Token refreshed');
	} catch (error) {
		return sendResponse(res, 401, 'error', 'Invalid or expired token');
	}
}

export { signupUser, loginUser, getSignedUser, logoutUser, refreshToken };
