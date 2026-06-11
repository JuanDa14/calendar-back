import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { setIO } from './emitter.js';

export const initSocket = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.FRONTEND_URL,
			credentials: true,
		},
	});

	io.use((socket, next) => {
		const token = socket.handshake.auth?.token;

		if (!token) {
			return next(new Error('No autorizado'));
		}

		try {
			const { uid, name } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
			socket.uid = uid;
			socket.name = name;
			next();
		} catch {
			next(new Error('Token inválido'));
		}
	});

	io.on('connection', (socket) => {
		socket.join(`user:${socket.uid}`);
	});

	setIO(io);
	return io;
};
