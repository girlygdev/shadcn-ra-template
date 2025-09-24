import { Request, Response } from 'express';
import { sendResponse } from '../../utils/response.js';
import UserService from './user.service.js';
import paginate from '../../utils/paginate.js';
import { User } from './user.model.js';

/**
 * List all users
 *
 * @route /api/users
 * @param {Request} req
 * @param {Response} res
 */
const getUsers = async (req: Request, res: Response) => {
	const { page: reqPage = 1, limit: reqLimit = 10, search = ''} = req.query;
	const query = search ? { 
		$or: [
			{ name: { $regex: search , $options: 'i' } },
			{ email: { $regex: search , $options: 'i' } }
		]
	} : {};

	const { data, total, page, limit } = await paginate(User, query, Number(reqPage), Number(reqLimit));

	sendResponse(res, 201, 'success', 'List of all Users', data, total, page, limit );
};

/**
 * Create user
 *
 * @route POST /api/users
 * @param {Request} req
 * @param {Response} res
 */
const createUser = async (req: Request, res: Response) => {
	const user = await UserService.createUser(req.body);

	sendResponse(res, 201, 'success', 'User created successfully', user);
};

/**
 * Get user by ID
 *
 * @route GET /api/users/:id
 * @param {Request} req
 * @param {Response} res
 */
const getUserById = async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = await UserService.getUserById(id);

	if (user) {
		sendResponse(res, 200, 'success', 'User details', user);
	} else {
		sendResponse(res, 404, 'error', 'User not found');
	}
};

/**
 * Update user information
 * For admin updates only
 *
 * @route PUT /api/users/:id
 * @param {Request} req
 * @param {Response} res
 */
const updateUser = async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = await UserService.updateUser(id, req.body);

	sendResponse(res, 200, 'success', 'User updated', user);
};

/**
 * Delete user
 * Soft delete user on DB 
 * 
 * @route DELETE /api/users/:id
 * @param {Request} req
 * @param {Response} res
 */
const deleteUser = async (req: Request, res: Response) => {
	const id = req.params.id;
	const result = await UserService.deleteUser(id);

	sendResponse(res, 204, 'success', 'User deleted', result);
}

/**
 * Restore deleted user
 *
 * @route PUT /api/users/:id/restore
 * @param {Request} req
 * @param {Response} res
 */
const restoreUser = async (req: Request, res: Response) => {
	const id = req.params.id;
	const result = await UserService.restoreUser(id);

	sendResponse(res, 200, 'success', 'User restored', result);
}

/**
 * Update user profile for frontend use
 *
 * @route PUT /api/users/:id/update-profile
 * @param {Request} req
 * @param {Response} res
 */
const updateUserProfile = async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = await UserService.updateProfile(id, req.body);
	sendResponse(res, 200, 'success', 'User profile updated', user);
}

/**
 * Update user password
 * 
 * @route PUT /api/users/:id/change-password
 * @param {Request} req
 * @param {Response} res
 */
const updateUserPassword = async (req: Request, res: Response) => {
	const id = req.params.id;
	const { oldPassword, newPassword } = req.body;

	const user = await UserService.updatePassword(id, oldPassword, newPassword);
	sendResponse(res, 200, 'success', 'User password updated', user);
}

export {
	createUser, getUsers, getUserById, updateUser,
	deleteUser, restoreUser,
	updateUserProfile, updateUserPassword,
};
