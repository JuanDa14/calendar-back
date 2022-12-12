export const formatUser = (user) => {
	if (user.team) {
		return {
			uid: user._id,
			name: user.name,
			verified: user.verified,
			team: user.team.name,
		};
	}

	return {
		uid: user._id,
		name: user.name,
		verified: user.verified,
	};
};

export const formatMember = (member) => ({
	_id: member._id,
	name: member.name,
	email: member.email,
});
