import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from './db.js';
import { errorHandler } from './middleware/errrorHandler.js';
import { sendResponse } from './utils/response.js';
import authRoutes from './modules/auth/auth.route.js';
import userRoutes from './modules/users/user.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// parse requests with JSON payload
app.use(express.json());

// Routes
app.use('/api', authRoutes)
app.use('/api/users', userRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
	sendResponse(res, 200, "success", "Hello from RestClinic Express API 🚀");
})

// error handling for unkown routes
app.use((req: Request, res: Response) => {
	sendResponse(res, 404, "error", "Request not found.");
});

// error  handling middleware
app.use(errorHandler);

// listen on port
app.listen(PORT, () => {
	console.log('🚀 Server is running.')
});
