export const formatJoinRequest = (request) => ({
	_id: request._id,
	status: request.status,
	createdAt: request.createdAt,
	team: {
		_id: request.team?._id || request.team,
		name: request.team?.name,
	},
	user: {
		_id: request.user?._id || request.user,
		name: request.user?.name,
		email: request.user?.email,
		avatar: request.user?.avatar || null,
	},
});
