import jwt from 'jsonwebtoken';

export const generarAccessToken = (uid, name) => {
	return new Promise((resolve, reject) => {
		const payload = { uid, name };

		jwt.sign(
			payload,
			process.env.SECRET_ACCESS_TOKEN,
			{
				expiresIn: '2h',
			},
			(err, token) => {
				if (err) {
					reject('No se pudo generar el token');
				}
				resolve(token);
			}
		);
	});
};

export const generarRefreshToken = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRET_REFRESH_TOKEN,
			{
				expiresIn: '30d',
			},
			(err, token) => {
				if (err) {
					reject('No se pudo generar el token');
				}
				resolve(token);
			}
		);
	});
};

export const generarJWT = async (uid, name) => {
	const accessToken = await generarAccessToken(uid, name);
	const refreshToken = await generarRefreshToken(uid);

	return {
		accessToken,
		refreshToken,
	};
};
