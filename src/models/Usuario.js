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

		avatar: {
			type: String,
			default: '',
			trim: true,
		},

		avatarPublicId: {
			type: String,
			default: '',
			trim: true,
		},

		bio: {
			type: String,
			default: '',
			trim: true,
			maxlength: 280,
		},

		phone: {
			type: String,
			default: '',
			trim: true,
			maxlength: 20,
		},

		jobTitle: {
			type: String,
			default: '',
			trim: true,
			maxlength: 80,
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

usuarioSchema.pre('save', function () {
	if (!this.isModified('password')) return;

	const salt = bcrypt.genSaltSync();
	this.password = bcrypt.hashSync(this.password, salt);
});

usuarioSchema.methods.comparePassword = function (password) {
	const user = this;
	return bcrypt.compareSync(password, user.password);
};

const Usuario = models.Usuario || model('Usuario', usuarioSchema);

export default Usuario;
