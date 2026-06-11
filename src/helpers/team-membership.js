import { Evento, Team, Usuario } from '../models/index.js';

export const addUserToTeam = async (teamId, uid) => {
	const team = await Team.findById(teamId).select('name description members owner events');

	if (!team) {
		throw new Error('Equipo no encontrado');
	}

	if (team.owner.toString() === uid.toString()) {
		throw new Error('Ya eres el propietario de este equipo');
	}

	if (team.members.some((memberId) => memberId.toString() === uid.toString())) {
		throw new Error('Ya eres miembro de este equipo');
	}

	const userEvents = await Evento.find({ user: uid }).select('_id').lean();

	team.members.push(uid);

	for (const event of userEvents) {
		const exists = team.events.some((eventId) => eventId.toString() === event._id.toString());
		if (!exists) team.events.push(event._id);
	}

	await team.save();
	await Usuario.findByIdAndUpdate(uid, { team: team._id });

	const owner = await Usuario.findById(team.owner).select('name').lean();
	const populatedMembers = await Usuario.find({ _id: { $in: team.members } })
		.select('name email avatar')
		.lean();

	return {
		id: team._id,
		name: team.name,
		description: team.description || '',
		owner: { _id: team.owner, name: owner?.name },
		members: populatedMembers.map((member) => ({
			_id: member._id,
			name: member.name,
			email: member.email,
			avatar: member.avatar || null,
		})),
	};
};
