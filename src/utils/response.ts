import { Response } from 'express';

interface ApiResponse<T = unknown> {
	status: "success" | "error",
	message: string;
	data?: T;
}

export const sendResponse = <T>(
	res: Response,
	code: number,
	status: "success" | "error",
	message: string,
	data?: T
) => {
	const response: ApiResponse<T> = { status, message };

	if (data !== undefined) {
		response.data = data;
	}

	return res.status(code).json(response);
}
