import { ValidationError } from './errors';

export class TeamIdValidator {
	static validate(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const teamId = parseInt(id);
			if (!this.validateNumber(teamId)) {
				reject(
					new ValidationError('Team ID must be a positive integer')
				);
			} else {
				resolve(teamId);
			}
		});
	}

	private static validateNumber(teamId: number): boolean {
		return Number.isInteger(teamId) && teamId > 0;
	}
}
