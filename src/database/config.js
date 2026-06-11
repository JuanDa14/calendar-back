import mongoose from 'mongoose';

const globalCache = globalThis;

if (!globalCache._mongooseCache) {
	globalCache._mongooseCache = { conn: null, promise: null };
}

const cache = globalCache._mongooseCache;

export const dbConnection = async () => {
	if (cache.conn) {
		return cache.conn;
	}

	if (!cache.promise) {
		const uri = process.env.MONGO_URI;

		if (!uri) {
			throw new Error('MONGO_URI no está definida en las variables de entorno');
		}

		console.log('Conectando a la base de datos...');

		cache.promise = mongoose
			.connect(uri)
			.then((mongooseInstance) => {
				console.log('Base de datos conectada');
				return mongooseInstance;
			})
			.catch((error) => {
				cache.promise = null;
				console.error('Error de conexión a MongoDB:', error.message);
				throw new Error('Error al conectar con la base de datos');
			});
	}

	cache.conn = await cache.promise;
	return cache.conn;
};
