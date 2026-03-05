let io;

export const setIO = (ioInstance) => {
    io = ioInstance;
};

export const getIO = () => {
    return io;
};

export const emitToRoom = (roomId, event, data) => {
    if (io) {
        console.log(`[Socket] Emitting ${event} to room ${roomId}`);
        io.to(roomId).emit(event, data);
    } else {
        console.warn(`[Socket] FAILED to emit ${event}: io instance not initialized`);
    }
};

export const emitToUser = (userId, event, data) => {
    if (io) {
        console.log(`[Socket] Emitting ${event} to user ${userId}`);
        io.to(`user_${userId}`).emit(event, data);
    } else {
        console.warn(`[Socket] FAILED to emit ${event}: io instance not initialized`);
    }
};
