import dotenv from 'dotenv';
import app from './src/app.js';
import { dbConnection } from './src/database/index.js';

dotenv.config();

export default app;

const startServer = async () => {
	try {
		await dbConnection();

		const PORT = process.env.PORT || 4000;

		app.listen(PORT, () => {
			console.log(`Servidor corriendo en el puerto ${PORT}`);
		});
	} catch (error) {
		console.error('Error al iniciar el servidor:', error.message);
		process.exit(1);
	}
};

if (!process.env.VERCEL) {
	startServer();
}
