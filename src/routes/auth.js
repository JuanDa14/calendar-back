import { Router } from 'express';
import { check } from 'express-validator';

import {
	crearUsuario,
	loginUsuario,
	olvidoContraña,
	restablecerContraseña,
	revalidarToken,
	verficarUsuario,
} from '../controllers/index.js';

import {
	CompararPassword,
	UsuarioEstaVerificado,
	ExisteUsuarioPorEmailEnDB,
	NoExisteUsuarioPorEmailEnDB,
	UsuarioNoEstaVerificado,
	validarCampos,
	verifyRefreshToken,
	NoExisteUsuarioPorTokenEnDB,
} from '../middlewares/index.js';

const router = Router();

router.post(
	'/register',
	[
		check('name', 'El nombre es obligatorio').notEmpty().isString().trim(),
		check('email', 'El email es obligatorio').notEmpty().isEmail().normalizeEmail().trim(),
		check('password', 'El password debe de ser de 6 caracteres')
			.notEmpty()
			.isString()
			.trim()
			.isLength({ min: 6 }),
		check('email').custom(ExisteUsuarioPorEmailEnDB),
		validarCampos,
	],
	crearUsuario
);

router.post(
	'/login',
	[
		check('email', 'El email es obligatorio').notEmpty().isEmail().normalizeEmail().trim(),
		check('password', 'El password debe de ser de 6 caracteres')
			.notEmpty()
			.isString()
			.trim()
			.isLength({ min: 6 }),
		check('email').custom(NoExisteUsuarioPorEmailEnDB),
		check('email').custom(UsuarioNoEstaVerificado),
		check('email').custom(CompararPassword),
		validarCampos,
	],
	loginUsuario
);

router.get('/refresh', verifyRefreshToken, revalidarToken);

router.get(
	'/verified/:token',
	[
		check('token').notEmpty().trim(),
		check('token').custom(NoExisteUsuarioPorTokenEnDB),
		check('token').custom(UsuarioEstaVerificado),
		validarCampos,
	],
	verficarUsuario
);

router.post(
	'/forgot-password',
	[
		check('email', 'Email no valido').isEmail().normalizeEmail().trim(),
		check('email').custom(NoExisteUsuarioPorEmailEnDB),
		validarCampos,
	],
	olvidoContraña
);

router.post(
	'/reset-password/:token',
	[
		check('token').isString().trim().notEmpty(),
		check('password').notEmpty().trim().isLength({ min: 6 }),
		check('token').custom(NoExisteUsuarioPorTokenEnDB),
		validarCampos,
	],
	restablecerContraseña
);

export default router;
