export const ErrorType = {
	VALIDATION_ERROR: 'ValidationError',
	NOT_FOUND_ERROR: 'NotFoundError',
	NETWORK_ERROR: 'NetworkError',
	SERVER_ERROR: 'ServerError',
	RATE_LIMIT_ERROR: 'RateLimitError',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export interface ApiError {
	message: string;
	status: number;
	type: ErrorType;
}

export class AppError extends Error {
	public readonly status: number;
	public readonly type: ErrorType;

	constructor(message: string, status: number, type: ErrorType) {
		super(message);
		this.name = 'AppError';
		this.status = status;
		this.type = type;
	}

	static fromResponse(error: any): AppError {
		if (error.response?.status === 404) {
			return new AppError(
				error.response.data?.message || 'Resource not found',
				404,
				ErrorType.NOT_FOUND_ERROR
			);
		}

		if (error.response?.status === 400) {
			return new AppError(
				error.response.data?.message || 'Validation error',
				400,
				ErrorType.VALIDATION_ERROR
			);
		}

		if (error.response?.status === 429) {
			return new AppError(
				error.response.data?.error || 'Too many requests',
				429,
				ErrorType.RATE_LIMIT_ERROR
			);
		}

		if (error.response?.status >= 500) {
			return new AppError(
				'Server error occurred',
				error.response.status,
				ErrorType.SERVER_ERROR
			);
		}

		if (!error.response) {
			return new AppError(
				'Network error occurred',
				0,
				ErrorType.NETWORK_ERROR
			);
		}

		return new AppError(
			error.message || 'Unknown error occurred',
			error.response?.status || 500,
			ErrorType.SERVER_ERROR
		);
	}

	get isNotFound(): boolean {
		return this.type === ErrorType.NOT_FOUND_ERROR;
	}

	get isValidation(): boolean {
		return this.type === ErrorType.VALIDATION_ERROR;
	}

	get isRateLimit(): boolean {
		return this.type === ErrorType.RATE_LIMIT_ERROR;
	}

	get isNetwork(): boolean {
		return this.type === ErrorType.NETWORK_ERROR;
	}
}
