export const formattedEvent = (evento, usuario) => {
	if (Array.isArray(evento)) {
		return evento.map((e) => {
			return {
				...e,
				user: usuario.name,
				userId: usuario._id,
			};
		});
	} else {
		return {
			...evento,
			user: usuario.name,
			userId: usuario._id,
		};
	}
};
