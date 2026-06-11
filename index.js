import http from 'http';

import dotenv from 'dotenv';
import app from './src/app.js';
import { dbConnection } from './src/database/index.js';
import { initSocket } from './src/socket/index.js';

dotenv.config();

export default app;

const startServer = async () => {
	try {
		await dbConnection();

		const PORT = process.env.PORT || 4000;
		const httpServer = http.createServer(app);

		initSocket(httpServer);

		httpServer.listen(PORT, () => {
			console.log(`Servidor corriendo en el puerto ${PORT}`);
			console.log('WebSocket activo (socket.io)');
		});
	} catch (error) {
		console.error('Error al iniciar el servidor:', error.message);
		process.exit(1);
	}
};

if (!process.env.VERCEL) {
	startServer();
}
