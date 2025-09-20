import { Request, Response, NextFunction } from "express";
import { sendResponse } from '../utils/response.js';

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.error(err);

	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	const details = err.details || null;

	sendResponse(res, status, "error", message, details || err);
}
