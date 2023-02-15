export const DEFAULT_LOCATION = 1;

export enum OrderStatus {
	'PENDING' = 'PENDING',
	'PAID' = 'PAID',
	'FAILED' = 'FAILED'
}

export enum CandidateStatuses {
	NewRegistration = 1,
	Scheduled = 2,
	NotResponding = 3,
	Undecided = 4,
	Ready = 5,
	Lost = 6
}

export enum DiscountTypes {
	'FIXED' = 'FIXED',
	'PERCENT' = 'PERCENT'
}

export const CUBE_VALIDITY_DAYS = 30;
export const DEFAULT_GATE = 1;

//  minimum distance to start from the moment of creating the schedule
export const SCHEDULE_MINIMUM_HOURS = 8;

// working hours interval
export const SCHEDULE_START_HOUR = 9;
export const SCHEDULE_END_HOUR = 19;

export const USED_DISCOUNTS = '1';
export const UNUSED_DISCOUNTS = '0';
