import { authenticate } from './authMiddleware.js';
import validateResource from './validateResource.js';


/**
 * Require Auth and Validate middleware
 *
 * @param {*} schema
 */
export const requireAuthAndValidate = (schema: any) => [
	authenticate,
	validateResource(schema)
]