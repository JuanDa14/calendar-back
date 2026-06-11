import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { auth, events, team } from './routes/index.js';
import { dbConnection } from './database/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error-handler.js';
import { generalLimiter, authLimiter } from './middlewares/rate-limiter.js';

const app = express();

const corsOptions = {
	origin: process.env.FRONTEND_URL,
	credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(express.json({ limit: '10kb' }));

app.use(async (req, res, next) => {
	try {
		await dbConnection();
		next();
	} catch (error) {
		next(error);
	}
});

app.get('/', (_req, res) => {
	res.status(200).json({
		ok: true,
		message: 'CalendarApp API',
		health: '/api/health',
	});
});

app.get('/api/health', (_req, res) => {
	res.status(200).json({
		ok: true,
		message: 'API funcionando correctamente',
		timestamp: new Date().toISOString(),
	});
});

app.use('/api/user', authLimiter, auth);
app.use('/api/events', events);
app.use('/api/team', team);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
