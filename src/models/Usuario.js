import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model, models } = mongoose;

const usuarioSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
			trim: true,
		},

		verified: {
			type: Boolean,
			default: false,
		},

		state: {
			type: String,
			enum: {
				values: ['active', 'inactive'],
				message: '{VALUE} is not a valid state',
			},
			default: 'active',
		},

		token: {
			type: String,
			default: '',
		},

		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team',
		},
	},
	{
		timestamps: true,
	}
);

usuarioSchema.method('toJSON', function () {
	const { __v, _id, password, verified, ...object } = this.toObject();
	object.id = _id;
	return object;
});

usuarioSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	const salt = bcrypt.genSaltSync();
	user.password = bcrypt.hashSync(user.password, salt);

	next();
});

usuarioSchema.methods.comparePassword = function (password) {
	const user = this;
	return bcrypt.compareSync(password, user.password);
};

const Usuario = models.Usuario || model('Usuario', usuarioSchema);

export default Usuario;
