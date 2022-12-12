import { response, request } from 'express';
import { v4 as uuid } from 'uuid';

import { Usuario } from '../models/index.js';
import {
	forgotPasswordLink,
	formatUser,
	generarJWT,
	sendEmail,
	verifiedLink,
} from '../helpers/index.js';

export const crearUsuario = async (req = request, res = response) => {
	const { email, name } = req.body;

	const token = uuid();

	try {
		await Usuario.create({
			...req.body,
			token,
		});

		const verifiedURL = verifiedLink(token);

		await sendEmail('validate-email', name, verifiedURL, email, 'Verifica tu cuenta');

		return res.status(200).json({
			ok: true,
			message: 'Revise su correo electrónico o Spam y ¡Confirme su correo electronico!',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const loginUsuario = async (req, res = response) => {
	const { email } = req.body;

	try {
		const usuario = await Usuario.findOne({ email })
			.select('name team verified')
			.populate('team', 'name');

		const { accessToken, refreshToken } = await generarJWT(usuario._id, usuario.name);

		const user = formatUser(usuario);

		res.status(200).json({
			ok: true,
			user,
			accessToken,
			refreshToken,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const revalidarToken = async (req, res = response) => {
	const { uid } = req;

	try {
		const userInDB = await Usuario.findById(uid)
			.select('name team verified')
			.populate('team', 'name')
			.lean();

		const { accessToken, refreshToken } = await generarJWT(userInDB._id, userInDB.name);

		const user = formatUser(userInDB);

		res.status(200).json({
			ok: true,
			user,
			accessToken,
			refreshToken,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const verficarUsuario = async (req, res) => {
	const { token } = req.params;

	try {
		const usuario = await Usuario.findOne({ token }).select('-__v -createdAt -updatedAt').lean();

		if (usuario.token !== token)
			return res.status(400).json({ ok: false, message: 'No tiene permisos para esta accion' });

		await Usuario.findByIdAndUpdate(usuario._id, {
			verified: true,
			token: '',
		});

		return res.status(200).json({
			ok: true,
			message: 'Usuario verificado',
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const olvidoContraña = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await Usuario.findOne({ email }).select('verified google name email').lean();

		if (!user.verified)
			return res.status(401).json({ ok: false, message: 'Cuenta no verificada' });

		const token = uuid();

		await Usuario.findByIdAndUpdate(user._id, { token });

		const forgotURL = forgotPasswordLink(token);

		await sendEmail(
			'forgot-password',
			user.name,
			forgotURL,
			user.email,
			'Restablecer contraseña'
		);

		return res
			.status(200)
			.json({
				ok: true,
				message: 'Revise su correo electrónico o Spam y restablezca su contraseña',
			});
	} catch (error) {
		return res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
	}
};

export const restablecerContraseña = async (req = request, res = response) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		const user = await Usuario.findOne({ token }).select('token');

		if (user.token !== token)
			return res.status(401).json({
				ok: false,
				message: 'No tienes permisos para esta accion',
			});

		user.password = password;

		user.token = '';

		await user.save();

		return res.status(200).json({ ok: true, message: 'Contraseña actualizada correctamente' });
	} catch (error) {
		return res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};
