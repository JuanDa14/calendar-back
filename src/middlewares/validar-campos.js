import { response } from 'express';
import { validationResult } from 'express-validator';

export const validarCampos = (req, res = response, next) => {
	const errors = validationResult(req);

	const errorArray = errors.array();

	const errorMap = errorArray.map((error) => ({
		message: error.msg,
		path: error.param,
		value: error.value,
	}));

	if (errorArray.length > 0) {
		return res.status(400).json({
			ok: false,
			errors: errorMap,
		});
	}

	next();
};
