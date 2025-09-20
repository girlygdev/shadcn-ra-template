import mongoose, { Schema, Document, Query, Model} from 'mongoose';
import bcrypt from "bcrypt";

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
	imageUrl?: string;
	isDeleted: boolean;
	deletedAt?: Date;
	createdAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  softDelete(userId: string): Promise<IUser | null>;
  restore(userId: string): Promise<IUser | null>;
}

const UserSchema: Schema<IUser> = new Schema(
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
			type: String,
			required: true,
			enum: Object.values(UserEnum),
		},
		imageUrl: {
			type: String,
			default: null
		},
		isDeleted: {
			type: Boolean,
			default: false
		},
		deletedAt: {
			type: Date,
			default: null
		}
	},
	{
		timestamps: true
	}
)

// Exclude soft-deleted users by default
UserSchema.pre<Query<any, any>>(/^find/, function (next) {
	this.where({ isDeleted: false });
	next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
	const user = this as IUser;

	console.log('called on save', user.password)

	if (!user.isModified("password")) {
		return next(); // skip if password is unchanged.
	}

	try {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (err) {
		next(err as Error)
	}
});

// Add method to compare passwords
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
}

// Custom method to soft delete users
UserSchema.statics.softDelete = async function (userId: string) {
	return this.findByIdAndUpdate(
		userId,
		{ isDeleted: true, deletedAt: new Date() },
		{ new: true }
	);
};

// Custom method to restore deleted users
UserSchema.statics.restore = async function (userId: string) {
	return this.findByIdAndUpdate(
		userId,
		{ isDeleted: false, deletedAt: null },
		{ new: true }
	);
};

export const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
