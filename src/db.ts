import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI);
	} catch (error) {
		console.error('Mongo DB connection error:', error);
		process.exit(1);
	}
}