import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnection } from './src/database/index.js';
import { auth, events, team } from './src/routes/index.js';
dotenv.config();

const options = {
	origin: process.env.FRONTEND_URL,
};

const app = express();

dbConnection();

app.use(cors(options));

app.use(express.json());

app.use('/api/user', auth);
app.use('/api/events', events);
app.use('/api/team', team);

app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
