import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
	if (!req.header('Authorization')) {
		return res.status(401).json({
			ok: false,
			message: 'No hay token en la petición',
		});
	}

	const token = req.header('Authorization').split(' ')[1];

	if (!token) return res.status(400).json({ ok: false, message: 'Falta algo en el header' });

	try {
		const { uid, name } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

		if (!uid) return res.status(401).json({ ok: false, message: 'El token ha caducido' });

		req.uid = uid;
		req.name = name;

		next();
	} catch (error) {
		return res.status(500).json({ ok: false, message: 'Hay un problema con su acceso' });
	}
};

export const verifyRefreshToken = (req, res, next) => {
	if (!req.header('Authorization')) {
		return res.status(401).json({
			ok: false,
			message: 'No hay token en la petición',
		});
	}

	const token = req.header('Authorization').split(' ')[1];

	if (!token) return res.status(400).json({ ok: false, message: 'Falta algo en el header' });

	try {
		const { uid } = jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);

		if (!uid) return res.status(401).json({ ok: false, message: 'El token ha caducado' });

		req.uid = uid;

		next();
	} catch (error) {
		return res.status(500).json({ ok: false, message: 'Hay un problema con su acceso' });
	}
};
