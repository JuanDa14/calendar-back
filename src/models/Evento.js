import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const eventoSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},

		notes: {
			type: String,
			trim: true,
		},

		start: {
			type: String,
			required: true,
			trim: true,
		},

		end: {
			type: String,
			required: true,
			trim: true,
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Evento = models.Evento || model('Evento', eventoSchema);

export default Evento;
