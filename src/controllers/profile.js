import { request, response } from 'express';

import { deleteCloudinaryImage, uploadAvatarImage } from '../helpers/cloudinary.js';
import { formatUser } from '../helpers/format-user.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { Usuario } from '../models/index.js';

const profileSelect =
	'name email avatar avatarPublicId bio phone jobTitle team verified createdAt updatedAt';

const findProfileUser = (uid) =>
	Usuario.findById(uid).select(profileSelect).populate('team', 'name').lean();

export const getProfile = async (req = request, res = response) => {
	try {
		const usuario = await findProfileUser(req.uid);

		if (!usuario) {
			return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
		}

		res.status(200).json({
			ok: true,
			user: formatUser(usuario),
		});
	} catch (error) {
		console.error('getProfile error:', error);
		res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
	}
};

export const updateProfile = async (req = request, res = response) => {
	const { name, bio = '', phone = '', jobTitle = '' } = req.body;

	try {
		const usuario = await Usuario.findByIdAndUpdate(
			req.uid,
			{
				name: name.trim(),
				bio: bio?.trim() || '',
				phone: phone?.trim() || '',
				jobTitle: jobTitle?.trim() || '',
			},
			{ new: true, runValidators: true }
		)
			.select(profileSelect)
			.populate('team', 'name')
			.lean();

		if (!usuario) {
			return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
		}

		res.status(200).json({
			ok: true,
			user: formatUser(usuario),
			message: 'Perfil actualizado correctamente',
		});
	} catch (error) {
		console.error('updateProfile error:', error);
		res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
	}
};

export const uploadProfileAvatar = async (req = request, res = response) => {
	if (!isCloudinaryConfigured()) {
		return res.status(503).json({
			ok: false,
			message: 'El servicio de imágenes no está configurado',
		});
	}

	if (!req.file) {
		return res.status(400).json({
			ok: false,
			message: 'Debes enviar una imagen',
		});
	}

	try {
		const usuario = await Usuario.findById(req.uid).select('avatarPublicId');

		if (!usuario) {
			return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
		}

		const previousPublicId = usuario.avatarPublicId;
		const result = await uploadAvatarImage(req.file.buffer, req.uid);

		if (previousPublicId && previousPublicId !== result.public_id) {
			await deleteCloudinaryImage(previousPublicId);
		}

		await Usuario.findByIdAndUpdate(req.uid, {
			avatar: result.secure_url,
			avatarPublicId: result.public_id,
		});

		const updatedUser = await findProfileUser(req.uid);

		res.status(200).json({
			ok: true,
			user: formatUser(updatedUser),
			message: 'Foto de perfil actualizada',
		});
	} catch (error) {
		console.error('uploadProfileAvatar error:', error);
		res.status(500).json({
			ok: false,
			message: error.message || 'No se pudo subir la imagen',
		});
	}
};

export const deleteProfileAvatar = async (req = request, res = response) => {
	try {
		const usuario = await Usuario.findById(req.uid).select('avatar avatarPublicId');

		if (!usuario) {
			return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
		}

		if (!usuario.avatar && !usuario.avatarPublicId) {
			return res.status(400).json({
				ok: false,
				message: 'No tienes foto de perfil para eliminar',
			});
		}

		if (usuario.avatarPublicId) {
			await deleteCloudinaryImage(usuario.avatarPublicId);
		}

		await Usuario.findByIdAndUpdate(req.uid, {
			avatar: '',
			avatarPublicId: '',
		});

		const updatedUser = await findProfileUser(req.uid);

		res.status(200).json({
			ok: true,
			user: formatUser(updatedUser),
			message: 'Foto de perfil eliminada',
		});
	} catch (error) {
		console.error('deleteProfileAvatar error:', error);
		res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
	}
};
