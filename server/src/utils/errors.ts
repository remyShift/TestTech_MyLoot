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
	static handleControllerError(error: Error, res: any): void {
		if (error instanceof ValidationError) {
			res.status(400).json({ error: error.message });
		} else if (error instanceof NotFoundError) {
			res.status(404).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
