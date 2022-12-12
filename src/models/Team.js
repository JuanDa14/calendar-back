import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

export const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},

		description: {
			type: String,
			trim: true,
		},

		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Usuario',
			},
		],

		owner: {
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
			required: true,
		},

		events: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Evento',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Team = models.Team || model('Team', teamSchema);

export default Team;
