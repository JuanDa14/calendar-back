import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const AVATAR_FOLDER = 'calendar-app/avatars';

export const uploadAvatarImage = (buffer, userId) => {
	if (!isCloudinaryConfigured()) {
		return Promise.reject(new Error('Cloudinary no está configurado'));
	}

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: AVATAR_FOLDER,
				public_id: `user_${userId}`,
				overwrite: true,
				invalidate: true,
				resource_type: 'image',
				transformation: [
					{ width: 400, height: 400, crop: 'fill', gravity: 'auto' },
					{ quality: 'auto', fetch_format: 'auto' },
				],
			},
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			}
		);

		uploadStream.end(buffer);
	});
};

export const deleteCloudinaryImage = async (publicId) => {
	if (!publicId || !isCloudinaryConfigured()) return;

	try {
		await cloudinary.uploader.destroy(publicId, { invalidate: true });
	} catch (error) {
		console.error('Error al eliminar imagen de Cloudinary:', error);
	}
};
