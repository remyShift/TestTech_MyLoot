import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		error: 'Too many requests from this IP, please try again later.',
		retryAfter: '15 minutes',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export const strictLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: {
		error: 'Too many create requests from this IP, please try again later.',
		retryAfter: '15 minutes',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export const heavyQueryLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 50,
	message: {
		error: 'Too many heavy queries from this IP, please try again later.',
		retryAfter: '5 minutes',
	},
	standardHeaders: true,
	legacyHeaders: false,
});
