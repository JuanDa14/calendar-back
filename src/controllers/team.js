import { request, response } from 'express';
import { formatMember } from '../helpers/index.js';
import { Evento, Team, Usuario } from '../models/index.js';

export const getEventsTeam = async (req = request, res = response) => {
	const { uid } = req;

	try {
		const eventosInDB = await Team.findOne({
			$or: [{ owner: uid }, { members: uid }],
		})
			.populate('owner', 'name')
			.populate('members', 'name email')
			.populate('events', 'title end start notes user')
			.select('name description')
			.lean();

		const eventosFormated = await Promise.all(
			eventosInDB.events.map(async (evento) => {
				const usuario = await Usuario.findById(evento.user).select('name').lean();
				evento.userId = evento.user.toString();
				evento.user = usuario.name;
				return evento;
			})
		);

		const teamFormated = {
			...eventosInDB,
			events: eventosFormated,
		};

		if (eventosFormated.length === 0) {
			return res.status(200).json({
				ok: false,
				message: 'No hay eventos en este equipo',
			});
		}

		res.status(200).json({
			ok: true,
			eventos: teamFormated,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const createTeam = async (req = request, res = response) => {
	const { uid } = req;
	const { members, name, description } = req.body;

	try {
		const usuario = await Usuario.findById(uid);

		await Evento.deleteMany({ user: uid });

		const NewMembers = members.map((member) => member._id);

		const team = await Team.create({
			owner: uid,
			name,
			description,
			members: NewMembers,
		});

		usuario.team = team._id;

		await usuario.save();

		if (members.length > 0) {
			members.map(async ({ _id }) => {
				const usuario = await Usuario.findById(_id);
				usuario.team = team._id;
				await usuario.save();
			});
		}

		const owner = {
			_id: usuario._id,
			name: usuario.name,
		};

		const teamFormated = {
			members,
			owner,
			name: team.name,
			id: team._id,
			description: team.description,
		};

		res.status(201).json({
			ok: true,
			team: teamFormated,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const addMember = async (req = request, res = response) => {
	const { id } = req.params;
	const { email } = req.body;

	try {
		const team = await Team.findById(id);

		const usuario = await Usuario.findOne({ email });

		if (team.members.includes(usuario._id)) {
			return res.status(400).json({
				ok: false,
				message: 'El usuario ya pertenece al equipo',
			});
		}

		usuario.team = team._id;

		team.members.push(usuario._id);

		await usuario.save();

		await team.save();

		const member = formatMember(usuario);

		res.status(200).json({
			ok: true,
			member,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const deleteMember = async (req = request, res = response) => {
	const { id } = req.params;
	const { email } = req.body;

	try {
		const team = await Team.findById(id).populate('events', 'user');

		const usuario = await Usuario.findOne({ email });

		if (!team.members.includes(usuario._id)) {
			return res.status(400).json({
				ok: false,
				message: 'El usuario no pertenece al equipo',
			});
		}

		team.members = team.members.filter((member) => member.toString() !== usuario._id.toString());
		team.events = team.events.filter((event) => event.user.toString() !== usuario._id.toString());

		await Evento.deleteMany({ user: usuario._id });

		await team.save();

		usuario.team = null;

		await usuario.save();

		res.status(200).json({
			ok: true,
			message: 'Miembro eliminado',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const searchMember = async (req = request, res = response) => {
	const { email } = req.body;

	try {
		const usuario = await Usuario.findOne({ email }).select('name team email').lean();

		if (usuario._id.toString() === req.uid) {
			return res.status(400).json({
				ok: false,
				message: 'No puede agregarse a si mismo',
			});
		}

		if (usuario.team) {
			return res.status(400).json({
				ok: false,
				message: 'El usuario buscado ya pertenece a un equipo',
			});
		}

		res.status(200).json({
			ok: true,
			usuario,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const deleteTeam = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		await Usuario.findByIdAndUpdate(req.uid, { team: null });

		const team = await Team.findByIdAndDelete(id)
			.populate('members', 'team')
			.populate('events', 'user')
			.lean();

		team.members.forEach(async (member) => {
			const usuario = await Usuario.findById(member._id);

			usuario.team = null;

			await usuario.save();
		});

		team.events.forEach(async (event) => {
			await Evento.findByIdAndDelete(event._id);
		});

		res.status(200).json({
			ok: true,
			message: 'Equipo eliminado',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};
