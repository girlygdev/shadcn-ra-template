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
	const token = await AuthService.loginUser(req.body);

	sendResponse(res, 200, 'success', 'Successfully logged in', token);
}

export { signupUser, loginUser };
