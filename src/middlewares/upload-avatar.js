import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
	const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'), false);
	}
};

export const uploadAvatar = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
}).single('avatar');

export const handleUploadError = (err, _req, res, next) => {
	if (!err) return next();

	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				ok: false,
				message: 'La imagen no puede superar los 5 MB',
			});
		}
	}

	return res.status(400).json({
		ok: false,
		message: err.message || 'Error al subir la imagen',
	});
};
