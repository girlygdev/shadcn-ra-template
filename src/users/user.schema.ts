import { z } from "zod";
import { UserEnum } from './user.model.js';

export const createUserSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	email: z.email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum([UserEnum.Admin, UserEnum.Client, UserEnum.Coach] as const, {
		error: `Invalid role: must be one of ${Object.values(UserEnum).join(", ")}`,
	}),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
