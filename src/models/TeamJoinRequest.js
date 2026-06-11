import { Schema, model } from 'mongoose';

const teamJoinRequestSchema = new Schema(
	{
		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team',
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
	},
	{ timestamps: true }
);

teamJoinRequestSchema.index({ team: 1, user: 1, status: 1 });
teamJoinRequestSchema.index(
	{ user: 1 },
	{ unique: true, partialFilterExpression: { status: 'pending' } }
);

export default model('TeamJoinRequest', teamJoinRequestSchema);
