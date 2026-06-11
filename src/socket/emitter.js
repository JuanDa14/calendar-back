let ioInstance = null;

export const setIO = (io) => {
	ioInstance = io;
};

export const getIO = () => ioInstance;

export const emitToUser = (userId, event, payload) => {
	if (!ioInstance || !userId) return;
	ioInstance.to(`user:${userId}`).emit(event, payload);
};
