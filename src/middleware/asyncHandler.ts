import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any>;

/**
 * Wraps an async route/controller function to catch errors
 * and forward them to Express error handling middleware.
 *
 * @param fn - The async controller or middleware function
 * @returns A wrapped function that automatically calls next(err) on failure
 */
export const asyncHandler =
	(fn: AsyncHandler): RequestHandler =>
	(req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
