import { Request, Response, NextFunction  } from 'express';
import jwt, { JwtPayload} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // set this in your env

// Augment Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | string;
  }
}


/**
 * Get token from request cookie
 * or from Authorization as Bearer {token}
 *
 * @param {Request} req
 * @return {*}  {(string | null)}
 */
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

/**
 * Authenticate middleware by verifying auth from request cookie
 *
 * @param {AuthenticatedRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */

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