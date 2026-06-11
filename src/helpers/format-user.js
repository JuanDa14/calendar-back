export const formatUser = (user) => {
	const base = {
		uid: user._id,
		name: user.name,
		email: user.email,
		verified: user.verified,
		avatar: user.avatar || null,
		bio: user.bio || '',
		phone: user.phone || '',
		jobTitle: user.jobTitle || '',
	};

	if (user.team) {
		return {
			...base,
			team: user.team.name,
		};
	}

	return base;
};

export const formatMember = (member) => ({
	_id: member._id,
	name: member.name,
	email: member.email,
	avatar: member.avatar || null,
});
