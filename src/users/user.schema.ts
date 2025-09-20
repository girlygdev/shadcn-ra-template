import { z } from 'zod';
import { UserEnum } from './user.model.js';

export const createUserSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	role: z.enum([UserEnum.Admin, UserEnum.Client, UserEnum.Coach] as const, {
		error: `Invalid role: must be one of ${Object.values(UserEnum).join(', ')}`,
	}),
});

export const updateUserSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const updateUserProfileSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.email('Invalid email format'),
});

export const updateUserPasswordSchema = z.object({
	oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
	newPassword: z.string().min(6, 'Password must be at least 6 characters')
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;
