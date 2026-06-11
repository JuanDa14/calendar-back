import { Router } from 'express';
import { check } from 'express-validator';

import {
	deleteProfileAvatar,
	getProfile,
	updateProfile,
	uploadProfileAvatar,
} from '../controllers/profile.js';
import { handleUploadError, uploadAvatar, validarCampos, verifyToken } from '../middlewares/index.js';

const router = Router();

router.use(verifyToken);

router.get('/', getProfile);

router.patch(
	'/',
	[
		check('name', 'El nombre es obligatorio').notEmpty().isString().trim().isLength({ min: 3 }),
		check('bio', 'La biografía es demasiado larga').optional().isString().trim().isLength({ max: 280 }),
		check('phone', 'El teléfono es demasiado largo').optional().isString().trim().isLength({ max: 20 }),
		check('jobTitle', 'El cargo es demasiado largo').optional().isString().trim().isLength({ max: 80 }),
		validarCampos,
	],
	updateProfile
);

router.post('/avatar', uploadAvatar, handleUploadError, uploadProfileAvatar);
router.delete('/avatar', deleteProfileAvatar);

export default router;
