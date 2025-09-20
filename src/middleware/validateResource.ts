import { ZodObject, ZodError, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response.js';

type Target = 'body' | 'query' | 'params';

/**
 * Middleware to validate request body, query and params using Zod
 *
 * @param {ZodObject} schema Zod schema to validate against
 */
const validateResource =
	(schema: ZodObject<any> | ZodType<any>, target: Target = 'body') =>
	(req: Request, res: Response, next: NextFunction) => {
		// Ensure JSON request
		if (target === 'body' && !req.is('application/json')) {
			return sendResponse(res, 415, 'error', 'Unsupported Media Type. Expected application/json');
		}

		const input = req[target as keyof Request];
		const result = schema.safeParse(input);

		if (result.success) {
			// Optionally replace with parsed data for type safety
			(req as any)[target] = result.data;
			return next();
		}

		const err = result.error as ZodError;
		// Group issues by field: { field: string[] }
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const field = issue.path.join(".") || "form";
      if (!errors[field]) errors[field] = [];
      // Avoid duplicates while preserving order
      if (!errors[field].includes(issue.message)) {
        errors[field].push(issue.message);
      }
    }

		return sendResponse(res, 400, 'error', 'Validation failed', errors);
	};

export default validateResource;
