export const notFoundHandler = (req, res) => {
	res.status(404).json({
		ok: false,
		message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
	});
};

export const errorHandler = (err, req, res, _next) => {
	console.error('[Error]', err.message);

	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		ok: false,
		message: err.message || 'Error interno del servidor',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
};
