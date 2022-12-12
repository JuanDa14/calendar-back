import { Router } from 'express';
import { check } from 'express-validator';

import { crearEvento, getEventos, actualizarEvento, eliminarEvento } from '../controllers/index.js';
import {
	validarCampos,
	verifyToken,
	ExisteEventoEnDB,
	NoExisteEventoEnDB,
	EsOwnerOCreador,
} from '../middlewares/index.js';

const router = Router();

router.use(verifyToken);

router.get('/', getEventos);

router.post(
	'/',
	[
		check('title', 'El titulo es obligatorio').notEmpty().isString().trim(),
		check('start', 'La fecha de inicio es obligatorio').notEmpty().isString().trim(),
		check('end', 'La fecha de finalizacion es obligatorio').notEmpty().isString().trim(),
		check('title').custom(ExisteEventoEnDB),
		validarCampos,
	],
	crearEvento
);

router.put(
	'/:id',
	[
		check('id').notEmpty().isMongoId().trim(),
		check('id').custom(EsOwnerOCreador),
		check('id').custom(NoExisteEventoEnDB),
		check('title').custom(ExisteEventoEnDB),
		validarCampos,
	],
	actualizarEvento
);

router.delete(
	'/:id',
	[
		check('id').notEmpty().isMongoId().trim(),
		check('id').custom(EsOwnerOCreador),
		check('id').custom(NoExisteEventoEnDB),
		validarCampos,
	],
	eliminarEvento
);

export default router;
