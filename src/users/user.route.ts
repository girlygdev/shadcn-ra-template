import { Request, Response } from "express";
import { User } from "./user.model.js";
import { createUserSchema } from './user.schema.js';
import { sendResponse } from '../utils/response.js';

export class UserController {

	/**
	 * List all users
	 * 
	 * @route	GET /api/users
	 * @desc Fetch all user
	 * 
	 * @param {Request} req
	 * @param {Response} res
	 * @memberof UserController
	 */
	static async getUsers(req: Request, res: Response) {
		try {
			const users = await User.find()

			return sendResponse(res, 201, "success", "List of all Users", users);
		} catch (error) {
			return sendResponse(res, 500, "error", "Failed to fetch users");
		}
	}

	static async createUser(req: Request, res: Response) {
		try {

		} catch (error) {
			return sendResponse(res, 500, "error", "Failed to fetch users");
		}
	}
}
