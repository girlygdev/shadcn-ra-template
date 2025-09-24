import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from './db.js';
import { errorHandler } from './middleware/errrorHandler.js';
import { sendResponse } from './utils/response.js';
import authRoutes from './modules/auth/auth.route.js';
import userRoutes from './modules/users/user.route.js';
import cors, { CorsOptions } from "cors";
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// Allow your frontend origin

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
	'http://localhost:3000',
	process.env.FRONTEND_URL
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // allow requests with no origin, like curl or mobile apps
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,   // allow cookies/auth headers
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 204, // helps legacy browsers
};

app.use(cookieParser());
app.use(cors(corsOptions));

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
