import { Response } from 'express';

interface ApiResponse<T = unknown> {
	status: "success" | "error",
	message: string;
	data?: T;
	total?: number,
	page?: number,
	limit?: number
}

export const sendResponse = <T>(
	res: Response,
	code: number,
	status: "success" | "error",
	message: string,
	data?: T,
	total?: number,
	page?: number,
	limit?: number
) => {
	const response: ApiResponse<T> = { status, message };

	if (data !== undefined) {
		response.data = data;
	}

	if (total !== undefined) {
		response.total = total;
	}

	if (page !== undefined) {
		response.page = page;
	}

	if (limit !== undefined) {
		response.limit = limit;
	}

	return res.status(code).json(response);
}
