import { User, UserEnum } from '../users/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { LoginInput, SignupInput } from './auth.schema.js';
import jwt from 'jsonwebtoken';

/**
 * Service layer for User Auth
 *
 * @class AuthService
 */
class AuthService {
	
	/**
	 * Generate token
	 *
	 * @static generateToken
	 * @param {InstanceType<typeof User>} user
	 * @returns {string} token
	 * @memberof AuthService
	 */
	static generateToken = (user: InstanceType<typeof User>) => {
		const payload = {
			userId: user._id,
			email: user.email,
			role: user.role
		};

		const token = jwt.sign(
			payload,
			process.env.JWT_SECRET!,
			{ expiresIn: '1h' }
		)
		
		return token;
	}

	/**
	 * Create a new user with Client role
	 *
	 * @static signupUser
	 * @throws {ApiError} if email is taken
	 * @param {SignupInput} input data for creating user
	 * @returns {Promise<User>} new user document
	 * @memberof AuthService
	 */
	static signupUser = async (input: SignupInput) => {
		const isEmailUnique = await User.findOne({ email: input.email });
		if (isEmailUnique) {
			throw new ApiError("Validation failed", 400, {
				"email": ["Email is already taken"]
			});
		}

		const user = new User({
			...input,
			role: UserEnum.Client
		})

		// save user
		await user.save();

		// retrieve user without password
		const newUser = await User.findById(user._id);
		
		// generate token for direct login
		const token = this.generateToken(newUser!);
		
		return {
			user: newUser,
			token
		};
	}


	/**
	 * Authenticate user when logging in
	 *
	 * @static loginUser
	 * @param {LoginInput} input data for logging in
	 * @throws {ApiError} on unauthorized users
	 * @returns {string} token
	 * @memberof AuthService
	 */
	static loginUser = async (input: LoginInput) => {
		const user = await User.findOne({ email: input.email }).select('+password');

		if (!user) {
			throw new ApiError("Unauthorized access", 400, {
				"email": ["Email or password did not match."]
			});
		}

		const isMatch = await user.comparePassword(input.password);
		if (!isMatch) {
			throw new ApiError("Unauthorized access", 400, {
				"email": ["Email or password did not match."]
			});
		}

		const token = this.generateToken(user);

		return token
	}
}

export default AuthService;
