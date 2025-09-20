import { ApiError } from '../utils/apiError.js';
import { IUser, User } from './user.model.js';
import { CreateUserInput } from './user.schema.js';
import bcrypt from 'bcrypt';

/**
 * Service layer for Users
 *
 * @class UserService
 */
class UserService {
	/**
	 * Retrieve all users
	 *
	 * @static getUsers
	 * @returns {Promise<User[]>} A promise that resolves to an array of user documents.
	 * @memberof UserService
	 */
	static getUsers = async () => {
		return await User.find();
	};

	/**
	 * Creates a new user if the email is unique.
	 *
	 * @static createUser
	 * @param {CreateUserInput} input - input data for creating user.
	 * @throws {ApiError} if the email is already taken.
	 * @returns {Promise<User>} Newly created user document.
	 * @memberof UserService
	 */
	static createUser = async (input: CreateUserInput) => {
		const isEmailUnique = await User.findOne({ email: input.email });
    if (isEmailUnique) {
      throw new ApiError("Validation failed", 400, {
				"email": ["Email is already taken"]
			});
    }

		const user = new User(input);
		return await user.save();
	};

	/**
	 * Get user by ID
	 *
	 * @static getUserById
	 * @param {string} userId ObjectId of User
	 * @returns {Promise<User>} Newly created user document.
	 * @memberof UserService
	 */
	static getUserById = async (userId: string) => {
		const user = await User.findById(userId);

		return user;
	};

	/**
	 * Update user data for Admin level usage
	 *
	 * @static updateUser
	 * @param {string} userId
	 * @param {IUser} updateData - input data for updating user profile
	 * @returns {Promise<User>} Updated created user document.
	 * @memberof UserService
	 */
	static updateUser = async (userId: string, updateData: Partial<IUser>) => {
		const allowedFields = ['name', 'email', 'password'] as const;

		const filteredUpdate: Partial<IUser> = {};
		for (const key of allowedFields) {
			if (updateData[key] !== undefined) {
				if (key === 'password') {
					const salt = await bcrypt.genSalt(10);
					filteredUpdate[key] = await bcrypt.hash(updateData[key], salt);
				} else {
					filteredUpdate[key] = updateData[key];
				}
			}
		}

		const user = await User.findByIdAndUpdate(userId, filteredUpdate, {
			new: true,
			runValidators: true,
		});

		return user;
	};

	/**
	 * Soft delete user by Id
	 *
	 * @static deleteUser
	 * @param {string} userId
	 * @returns {boolean} result when user is deleted
	 * @memberof UserService
	 */
	static deleteUser = async (userId: string) => {
		await User.softDelete(userId);

		return true;
	};
	
	/**
	 * Restore soft deleted user 
	 *
	 * @static restoreUser
	 * @param {string} userId
	 * @returns {boolean} result when user is restored
	 * @memberof UserService
	 */
	static restoreUser = async (userId: string) => {
		const user = await User.softDelete(userId);

		return user;
	};

	/**
	 * Update user profile name and image only
	 * for frontend use updates
	 *
	 * @static updateProfile
	 * @param {string} userId
	 * @param {IUser} updateData - input data for updating profile info
	 * @memberof UserService
	 */
	static updateProfile = async (
		userId: string,
		updateData: Partial<IUser>
	) => {
		const allowedFields = ['name', 'email', 'imageUrl'] as const;

		const filteredUpdate: Partial<IUser> = {};
		for (const key of allowedFields) {
			if (updateData[key] !== undefined) {
				filteredUpdate[key] = updateData[key];
			}
		}

		const user = await User.findByIdAndUpdate(userId, filteredUpdate, {
			new: true,
			runValidators: true,
		});

		return user;
	};

	
	/**
	 * Update password, user needs to provide their current
	 * password prior to update
	 * for frontend use upates
	 *
	 * @static updatePassword
	 * @param {string} userId
	 * @param {string} oldPassword
	 * @param {string} newPassword
	 * @throws {ApiError} returns error if password didnt match
	 * @returns {Promise<User>} returns updated user document
	 * @memberof UserService
	 */
	static updatePassword = async (
		userId: string,
		oldPassword: string,
		newPassword: string
	): Promise<IUser | null> => {
		// Find user and include password explicitly
		const user = await User.findById(userId).select('+password');
		if (!user) {
			throw new Error('User not found');
		}

		// Compare old password
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			throw new Error('Current password did not match.');
		}

		// Hash new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);

		// Save user
		await user.save();

		// Return user without password
		return await User.findById(userId);
	};
}

export default UserService;
