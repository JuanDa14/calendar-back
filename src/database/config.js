import mongoose from 'mongoose';

export const dbConnection = async () => {
	try {
		console.log('Conectando a la base de datos...');
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Base de datos conectada');
	} catch (error) {
		console.error('Error de conexión a MongoDB:', error.message);
		throw new Error('Error al conectar con la base de datos');
	}
};
