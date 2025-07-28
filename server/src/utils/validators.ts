export class TeamIdValidator {
	static validate(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const teamId = parseInt(id);
			if (Number.isNaN(teamId) || teamId <= 0) {
				reject(new Error('Team ID must be a positive integer'));
			} else {
				resolve(teamId);
			}
		});
	}

	static validateNumber(teamId: number): void {
		if (!Number.isInteger(teamId) || teamId <= 0) {
			throw new Error('Team ID must be a positive integer');
		}
	}
}
