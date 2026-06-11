import { Router } from 'express';
import { check, param } from 'express-validator';

import {
	addMember,
	approveJoinRequest,
	cancelJoinRequest,
	createTeam,
	deleteMember,
	deleteTeam,
	getEventsTeam,
	getJoinRequests,
	getMyJoinRequest,
	leaveTeam,
	rejectJoinRequest,
	requestJoinTeam,
	searchMember,
	searchTeams,
	updateTeam,
} from '../controllers/index.js';

import {
	EsCreadorDelTeam,
	ExisteElTeamPorIdEnDb,
	ExisteElTeamPorNombreEnDb,
	NoExisteUsuarioPorEmailEnDB,
	UsuarioEsOwnerDeUnTeam,
	validarCampos,
	verifyToken,
} from '../middlewares/index.js';

const router = Router();

router.use(verifyToken);

router.get('/', getEventsTeam);

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
	'/search/team',
	[
		check('query', 'La búsqueda debe tener al menos 2 caracteres')
			.notEmpty()
			.isString()
			.trim()
			.isLength({ min: 2 }),
		validarCampos,
	],
	searchTeams
);

router.get('/join-requests', getJoinRequests);

router.get('/my-join-request', getMyJoinRequest);

router.post(
	'/request-join/:id',
	[param('id').notEmpty().isMongoId(), validarCampos],
	requestJoinTeam
);

router.post(
	'/join-requests/:requestId/approve',
	[param('requestId').notEmpty().isMongoId(), validarCampos],
	approveJoinRequest
);

router.post(
	'/join-requests/:requestId/reject',
	[param('requestId').notEmpty().isMongoId(), validarCampos],
	rejectJoinRequest
);

router.delete(
	'/join-requests/:requestId',
	[param('requestId').notEmpty().isMongoId(), validarCampos],
	cancelJoinRequest
);

router.post('/leave', leaveTeam);

router.post(
	'/',
	[
		check('name', 'El nombre del equipo es obligatorio').notEmpty().isString().trim(),
		check('name').custom(ExisteElTeamPorNombreEnDb),
		check('name').custom(UsuarioEsOwnerDeUnTeam),
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
