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

		return result;
	}
}
