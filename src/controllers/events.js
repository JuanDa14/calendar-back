import { request, response } from 'express';
import { Evento, Usuario, Team } from '../models/index.js';
import { formattedEvent } from '../helpers/index.js';

export const getEventos = async (req, res = response) => {
	const { uid } = req;

	try {
		const eventos = await Evento.find({ user: uid })
			.select('title notes end start')
			.populate('user', 'name')
			.lean();

		const usuario = eventos.length > 0 ? eventos[0].user : null;

		const formatted = formattedEvent(eventos, usuario);

		res.status(200).json({
			ok: true,
			eventos: formatted,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};

export const crearEvento = async (req = request, res = response) => {
	const { uid } = req;

	try {
		const usuario = await Usuario.findById(uid).select('team name').lean();

		const evento = await Evento.create({
			user: uid,
			...req.body,
		});

		if (usuario.team) {
			const team = await Team.findOne({ $or: [{ owner: uid }, { members: uid }] });

			team.events.push(evento._id);
			await team.save();
		}

		const setEvent = {
			_id: evento._id,
			title: evento.title,
			notes: evento.notes,
			start: evento.start,
			end: evento.end,
		};

		const formatted = formattedEvent(setEvent, usuario);

		res.status(201).json({
			ok: true,
			evento: formatted,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};

export const actualizarEvento = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const usuario = await Usuario.findById(req.body.userId).select('name').lean();

		const evento = await Evento.findByIdAndUpdate(
			id,
			{
				...req.body,
				user: req.body.userId,
			},
			{
				new: true,
			}
		)
			.select('title notes end start')
			.lean();

		const formatted = formattedEvent(evento, usuario);

		res.status(200).json({
			ok: true,
			evento: formatted,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};

export const eliminarEvento = async (req, res = response) => {
	const { id } = req.params;

	const { uid } = req;

	try {
		const usuario = await Usuario.findById(uid).select('name team').lean();

		await Evento.findByIdAndDelete(id);

		if (usuario.team) {
			const team = await Team.findOne({ $or: [{ owner: uid }, { members: uid }] });
			team.events = team.events.filter((event) => event.toString() !== id);
			await team.save();
		}

		res.status(200).json({
			ok: true,
			message: 'Evento elimando correctamente',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};
