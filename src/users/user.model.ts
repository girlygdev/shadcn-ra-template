import mongoose, { Schema, Document } from 'mongoose';

export enum UserEnum {
	Admin = 'admin',
	Coach = 'coach',
	Client = 'client'
}

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: UserEnum;
	createdAt: Date;
}

const UserSchema: Schema = new Schema(
	{
		name: { 
			type: String, 
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: UserEnum,
			required: true,
			enum: Object.values(UserEnum),
		},
	},
	{
		timestamps:  true
	}
)

export const User = mongoose.model<IUser>("User", UserSchema);