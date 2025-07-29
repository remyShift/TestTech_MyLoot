import { ValidationError } from './errors';

export class TeamIdValidator {
	static validate(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const teamId = parseInt(id);
			if (!this.isPositiveInteger(teamId)) {
				reject(
					new ValidationError('Team ID must be a positive integer')
				);
			} else {
				resolve(teamId);
			}
		});
	}

	private static isPositiveInteger(teamId: number): boolean {
		return Number.isInteger(teamId) && teamId > 0;
	}
}

export class DateValidator {
	static async validateOptionalDates(
		from?: string,
		to?: string
	): Promise<{ from?: Date; to?: Date }> {
		if (!from && !to) {
			return {};
		}

		const result: { from?: Date; to?: Date } = {};

		if (from) {
			const fromDate = new Date(from);
			if (isNaN(fromDate.getTime())) {
				throw new ValidationError(
					'Invalid date format for from parameter'
				);
			}
			result.from = fromDate;
		}

		if (to) {
			const toDate = new Date(to);
			if (isNaN(toDate.getTime())) {
				throw new ValidationError(
					'Invalid date format for to parameter'
				);
			}
			result.to = toDate;
		}

		if (result.from && result.to && result.from >= result.to) {
			throw new ValidationError('From date must be earlier than to date');
		}

		return result;
	}
}

export class PaginationValidator {
	static async validatePagination(
		page?: string,
		limit?: string
	): Promise<{ page?: number; limit?: number }> {
		const result: { page?: number; limit?: number } = {};

		if (page) {
			const parsedPage = parseInt(page);
			if (!Number.isInteger(parsedPage) || parsedPage < 1) {
				throw new ValidationError(
					'Page must be a positive integer starting from 1'
				);
			}
			result.page = parsedPage;
		}

		if (limit) {
			const parsedLimit = parseInt(limit);
			if (
				!Number.isInteger(parsedLimit) ||
				parsedLimit < 1 ||
				parsedLimit > 100
			) {
				throw new ValidationError(
					'Limit must be a positive integer between 1 and 100'
				);
			}
			result.limit = parsedLimit;
		}

		if (result.page && !result.limit) {
			throw new ValidationError(
				'Limit is required when page is provided'
			);
		}

		return result;
	}
}

export class UserIdValidator {
	static validate(userId: any): Promise<number> {
		return new Promise((resolve, reject) => {
			const parsedUserId = parseInt(userId);
			if (!this.isPositiveInteger(parsedUserId)) {
				reject(
					new ValidationError('User ID must be a positive integer')
				);
			} else {
				resolve(parsedUserId);
			}
		});
	}

	private static isPositiveInteger(userId: number): boolean {
		return Number.isInteger(userId) && userId > 0;
	}
}

export class AmountValidator {
	static validate(amount: any): Promise<number> {
		return new Promise((resolve, reject) => {
			const parsedAmount = parseFloat(amount);
			if (!this.isValidAmount(parsedAmount)) {
				reject(
					new ValidationError(
						'Amount must be a valid number (can be negative for debits)'
					)
				);
			} else {
				resolve(parsedAmount);
			}
		});
	}

	private static isValidAmount(amount: number): boolean {
		return Number.isInteger(amount) && !isNaN(amount);
	}
}
