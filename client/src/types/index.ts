export interface Member {
	id: number;
	name: string;
	teamId: number;
	totalCoins: number;
	percent: number;
}

export interface TeamStats {
	total: number;
	members: Member[];
}

export interface DateRange {
	from?: string;
	to?: string;
}

export interface ApiError {
	message: string;
	status: number;
}