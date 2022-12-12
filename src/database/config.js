import mongoose from 'mongoose';

export const dbConnection = async () => {
	try {
		console.log('Conectando a la base de datos');
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Base de datos online');
	} catch (error) {
		console.log(error);
		throw new Error('error a la hora de inicializar db');
	}
};
