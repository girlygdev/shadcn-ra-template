import { z } from 'zod';

export const authLoginSchema = z.object({
	email: z.email('Invalid email format'),
	password: z.string()
})

export const authSignupSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginInput = z.infer<typeof authLoginSchema>;
export type SignupInput = z.infer<typeof authSignupSchema>;
