import { request, response } from 'express';
import mongoose from 'mongoose';
import { formatMember } from '../helpers/index.js';
import { Evento, Team, Usuario } from '../models/index.js';

const getErrorMessage = (error) => {
	if (error?.code === 11000) {
		return 'Ya existe un equipo con ese nombre';
	}
	if (error?.name === 'ValidationError') {
		return Object.values(error.errors)[0]?.message || 'Datos del equipo no válidos';
	}
	if (error?.name === 'CastError') {
		return 'Uno de los identificadores enviados no es válido';
	}
	return 'Por favor hable con el administrador';
};

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

		if (!eventosInDB) {
			return res.status(200).json({
				ok: false,
				message: 'No perteneces a ningún equipo',
			});
		}

		const eventosFormated = await Promise.all(
			(eventosInDB.events || []).map(async (evento) => {
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
	const { members = [], name, description = '' } = req.body;
	let createdTeamId = null;

	try {
		const usuario = await Usuario.findById(uid).select('name team').lean();

		if (!usuario) {
			return res.status(404).json({
				ok: false,
				message: 'Usuario no encontrado',
			});
		}

		if (usuario.team) {
			return res.status(400).json({
				ok: false,
				message: 'Ya perteneces a un equipo',
			});
		}

		const memberIds = [
			...new Set(
				members
					.map((member) => member?._id || member?.id)
					.filter((id) => id && id.toString() !== uid.toString())
			),
		];

		for (const memberId of memberIds) {
			if (!mongoose.Types.ObjectId.isValid(memberId)) {
				return res.status(400).json({
					ok: false,
					message: 'Uno de los miembros tiene un ID no válido',
				});
			}

			const member = await Usuario.findById(memberId).select('team name email').lean();

			if (!member) {
				return res.status(400).json({
					ok: false,
					message: 'Uno de los miembros seleccionados no existe',
				});
			}

			if (member.team) {
				return res.status(400).json({
					ok: false,
					message: `${member.name || member.email} ya pertenece a un equipo`,
				});
			}
		}

		const userEvents = await Evento.find({ user: uid }).select('_id').lean();
		const eventIds = userEvents.map((event) => event._id);

		const team = await Team.create({
			owner: uid,
			name: name.trim(),
			description: description?.trim() || '',
			members: memberIds,
			events: eventIds,
		});

		createdTeamId = team._id;

		await Usuario.findByIdAndUpdate(uid, { team: team._id });

		if (memberIds.length > 0) {
			await Usuario.updateMany({ _id: { $in: memberIds } }, { team: team._id });
		}

		const populatedMembers = await Usuario.find({ _id: { $in: memberIds } })
			.select('name email')
			.lean();

		const teamFormated = {
			members: populatedMembers.map((member) => ({
				_id: member._id,
				name: member.name,
				email: member.email,
			})),
			owner: {
				_id: usuario._id,
				name: usuario.name,
			},
			name: team.name,
			id: team._id,
			description: team.description,
		};

		res.status(201).json({
			ok: true,
			team: teamFormated,
		});
	} catch (error) {
		console.error('createTeam error:', error);

		if (createdTeamId) {
			await Promise.all([
				Team.findByIdAndDelete(createdTeamId).catch(() => null),
				Usuario.findByIdAndUpdate(uid, { team: null }).catch(() => null),
				Usuario.updateMany({ team: createdTeamId }, { team: null }).catch(() => null),
			]);
		}

		const status = error?.code === 11000 || error?.name === 'ValidationError' ? 400 : 500;

		res.status(status).json({
			ok: false,
			message: getErrorMessage(error),
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
	const { query } = req.body;

	try {
		const trimmed = query?.trim();

		if (!trimmed || trimmed.length < 2) {
			return res.status(200).json({
				ok: true,
				usuarios: [],
			});
		}

		const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

		const usuarios = await Usuario.find({
			_id: { $ne: req.uid },
			team: null,
			$or: [{ email: regex }, { name: regex }],
		})
			.select('name email')
			.limit(8)
			.lean();

		res.status(200).json({
			ok: true,
			usuarios,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

export const updateTeam = async (req = request, res = response) => {
	const { id } = req.params;
	const { name, description } = req.body;

	try {
		const duplicate = await Team.findOne({ name, _id: { $ne: id } }).select('_id').lean();

		if (duplicate) {
			return res.status(400).json({
				ok: false,
				message: `El equipo con el nombre ${name} ya existe`,
			});
		}

		const team = await Team.findByIdAndUpdate(
			id,
			{ name, description },
			{ new: true, runValidators: true }
		)
			.select('name description')
			.lean();

		res.status(200).json({
			ok: true,
			team: {
				id: team._id,
				name: team.name,
				description: team.description,
			},
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
