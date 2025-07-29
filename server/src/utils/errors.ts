import { Response } from 'express';

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class ErrorHandler {
	static handleControllerError(error: Error, res: Response): void {
		if (error instanceof ValidationError) {
			res.status(400).json({
				message: error.message,
				status: 400,
			});
		} else if (error instanceof NotFoundError) {
			res.status(404).json({
				message: error.message,
				status: 404,
			});
		} else {
			console.error('Unexpected error:', error);
			res.status(500).json({
				message: 'Internal server error',
				status: 500,
			});
		}
	}
}
