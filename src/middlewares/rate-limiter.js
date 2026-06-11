import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		ok: false,
		message: 'Demasiadas solicitudes, intenta de nuevo más tarde.',
	},
});

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		ok: false,
		message: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
	},
});
