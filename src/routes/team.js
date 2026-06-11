import { Router } from 'express';
import { check } from 'express-validator';

import {
	addMember,
	createTeam,
	deleteMember,
	deleteTeam,
	getEventsTeam,
	searchMember,
	updateTeam,
} from '../controllers/index.js';

import {
	EsCreadorDelTeam,
	ExisteElTeamPorIdEnDb,
	ExisteElTeamPorNombreEnDb,
	NoExisteUsuarioPorEmailEnDB,
	UsuarioTieneUnTeam,
	validarCampos,
	verifyToken,
} from '../middlewares/index.js';

const router = Router();

router.use(verifyToken);

router.get('/', getEventsTeam);

router.post(
	'/',
	[
		check('name', 'El nombre del equipo es obligatorio').notEmpty().isString().trim(),
		check('name').custom(ExisteElTeamPorNombreEnDb),
		check('name').custom(UsuarioTieneUnTeam),
		validarCampos,
	],
	createTeam
);

router.post(
	'/:id',
	[
		check('id').notEmpty().isMongoId(),
		check('id').custom(ExisteElTeamPorIdEnDb),
		check('id').custom(EsCreadorDelTeam),
		check('email').custom(NoExisteUsuarioPorEmailEnDB),
		validarCampos,
	],
	addMember
);

router.post(
	'/search/member',
	[
		check('query', 'La búsqueda debe tener al menos 2 caracteres')
			.notEmpty()
			.isString()
			.trim()
			.isLength({ min: 2 }),
		validarCampos,
	],
	searchMember
);

router.post(
	'/delete/member/:id',
	[
		check('id').notEmpty().isMongoId(),
		check('id').custom(ExisteElTeamPorIdEnDb),
		check('id').custom(EsCreadorDelTeam),
		check('email').custom(NoExisteUsuarioPorEmailEnDB),
		validarCampos,
	],
	deleteMember
);

router.put(
	'/:id',
	[
		check('id').notEmpty().isMongoId(),
		check('id').custom(ExisteElTeamPorIdEnDb),
		check('id').custom(EsCreadorDelTeam),
		check('name', 'El nombre del equipo es obligatorio').notEmpty().isString().trim(),
		check('description', 'La descripción debe ser texto').optional().isString().trim(),
		validarCampos,
	],
	updateTeam
);

router.delete(
	'/:id',
	[
		check('id').notEmpty().isMongoId(),
		check('id').custom(ExisteElTeamPorIdEnDb),
		check('id').custom(EsCreadorDelTeam),
	],
	deleteTeam
);

export default router;
