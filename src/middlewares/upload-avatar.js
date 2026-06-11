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

const multerUpload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
}).single('avatar');

const formatUploadError = (err) => {
	if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
		return 'La imagen no puede superar los 5 MB';
	}
	return err.message || 'Error al subir la imagen';
};

export const uploadAvatar = (req, res, next) => {
	multerUpload(req, res, (err) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				message: formatUploadError(err),
			});
		}
		next();
	});
};
