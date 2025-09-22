import { Request, Response, NextFunction  } from 'express';
import jwt, { JwtPayload} from 'jsonwebtoken';
import { sendResponse } from '../utils/response.js';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

/**
 * Authenticate middleware
 *
 * @param {AuthenticatedRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return sendResponse(res, 401, 'error', 'No token provided.')
	}

	const token = authHeader?.split(' ')[1] ?? ''; // 'Bearer tokenString';

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // attach decoded token payload
    next();
	} catch (err) {
		sendResponse(res, 401, 'error', 'Unauthorized access');
	}
}
