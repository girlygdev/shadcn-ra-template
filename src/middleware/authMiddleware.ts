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
// export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
// 	const authHeader = req.headers.authorization;

// 	if (!authHeader || !authHeader.startsWith('Bearer')) {
// 		return sendResponse(res, 401, 'error', 'No token provided.')
// 	}

// 	const token = authHeader?.split(' ')[1] ?? ''; // 'Bearer tokenString';

// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = decoded; // attach decoded token payload
//     next();
// 	} catch (err) {
// 		sendResponse(res, 401, 'error', 'Unauthorized access');
// 	}
// }


const JWT_SECRET = process.env.JWT_SECRET!; // set this in your env

// Augment Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | string;
  }
}

function getTokenFromReq(req: Request): string | null {
  // Prefer HttpOnly cookie
  const cookieToken = (req.cookies && req.cookies.auth) || null;

  if (cookieToken) return cookieToken;

  // Fallback: Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ authenticated: false, message: "No token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    req.user = decoded; // typical payload includes { sub, email, roles, ... }
    next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ authenticated: false, message: "Token expired" });
    }
    return res.status(401).json({ authenticated: false, message: "Invalid token" });
  }
}