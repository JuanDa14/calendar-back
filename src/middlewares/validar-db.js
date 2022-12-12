import { Evento, Team, Usuario } from '../models/index.js';

//?Evento
export const NoExisteEventoEnDB = async (id) => {
	const existe = await Evento.findById(id).select('title').lean();

	if (!existe) {
		throw new Error(`El evento no existe`);
	}
};

export const ExisteEventoEnDB = async (title, { req }) => {
	const team = await Team.findOne({
		$or: [{ owner: req.uid }, { members: req.uid }],
	}).populate('events', 'title');

	const existe = await Evento.findOne({ title }).select('title user').lean();

	//TODO Comprobar que si es un team event no se pueda crear un evento con el mismo nombre
	if (team) {
		const existeTeam = team.events.find((event) => event.title === title);

		if (existeTeam) {
			throw new Error(`El evento ${title} ya existe en el equipo`);
		}
	}
	//TODO Comprobar que si es un personal event no se pueda crear un evento con el mismo nombre
	if (!team && existe && existe.user.toString() === req.uid.toString()) {
		throw new Error(`El evento ${title} ya existe`);
	}
};

//?Usuario
export const ExisteUsuarioPorEmailEnDB = async (email) => {
	const existe = await Usuario.findOne({ email }).select('email').lean();
	if (existe) {
		throw new Error(`El email ya esta registrado`);
	}
};

export const NoExisteUsuarioPorEmailEnDB = async (email) => {
	const existe = await Usuario.findOne({ email }).select('email').lean();

	if (!existe) {
		throw new Error(`El usuario no esta registrado`);
	}
};

export const NoExisteUsuarioPorTokenEnDB = async (token) => {
	const existe = await Usuario.findOne({ token }).select('email').lean();

	if (!existe) {
		throw new Error(`El usuario no esta registrado`);
	}
};

export const CompararPassword = async (email, { req }) => {
	const usuario = await Usuario.findOne({ email });

	if (!usuario.comparePassword(req.body.password)) {
		throw new Error(`Email o contraseña incorrecta`);
	}
};

export const UsuarioNoEstaVerificado = async (email) => {
	const usuario = await Usuario.findOne({ email }).select('verified state').lean();
	if (!usuario.verified || usuario.state === 'inactive') {
		throw new Error(`El usuario no esta verificado`);
	}
};

export const UsuarioEstaVerificado = async (token) => {
	const usuario = await Usuario.findOne({ token }).select('verified').lean();
	if (usuario.verified) {
		throw new Error(`El usuario ya esta verificado`);
	}
};

export const UsuarioTieneUnTeam = async (__, { req }) => {
	const usuario = await Usuario.findById(req.uid).select('team').lean();

	if (usuario.team) {
		throw new Error(`Ya perteneces a un equipo`);
	}
};

//?Team

export const ExisteElTeamPorNombreEnDb = async (name) => {
	const existe = await Team.findOne({ name }).select('name').lean();

	if (existe) {
		throw new Error(`El equipo con el nombre ${name} ya existe`);
	}
};

export const ExisteElTeamPorIdEnDb = async (id) => {
	const existe = await Team.findById(id).select('name').lean();

	if (!existe) {
		throw new Error(`El equipo con el nombre ${existe.name} no existe`);
	}
};

export const EsCreadorDelEvento = async (id, { req }) => {
	const evento = await Evento.findById(id).select('user').lean();

	if (evento.user.toString() !== req.uid) {
		throw new Error(`No tiene permisos sobre este evento`);
	}
};

export const EsCreadorDelTeam = async (id, { req }) => {
	const team = await Team.findById(id).select('owner').lean();

	if (team.owner.toString() !== req.uid) {
		throw new Error(`No tiene permisos sobre este equipo`);
	}
};

export const EsOwnerOCreador = async (id, { req }) => {
	const evento = await Evento.findById(id).select('user').lean();

	const team = await Team.findOne({ $or: [{ owner: req.uid }, { members: req.uid }] })
		.select('owner')
		.lean();

	if (team && ![team.owner.toString(), evento.user.toString()].includes(req.uid)) {
		throw new Error(`No tiene permisos sobre este equipo`);
	}
};
