const socketHandlers = (socket, io, connectedUsers, notificationQueue) => {
    console.log('A user connected:', socket.id);

    // Join room event
    socket.on('joinRoom', (userId) => {
        try {
            connectedUsers.set(userId, socket.id);
            socket.join(userId);
            console.log(`User with ID ${userId} joined room ${userId}`);

            // Send queued notifications if any
            if (notificationQueue.has(userId)) {
                notificationQueue.get(userId).forEach(notification => {
                    io.to(socket.id).emit('new-notification', { id: userId, message: notification });
                });
                notificationQueue.delete(userId);
            }
        } catch (error) {
            console.error('Error during joinRoom event:', error);
        }
    });

    // Leave room event
    socket.on('leaveRoom', (userId) => {
        connectedUsers.delete(userId);
        socket.leave(userId);
        console.log(`User with ID ${userId} left room ${userId}`);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        for (let [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                console.log(`User with ID ${userId} disconnected`);
                break;
            }
        }
    });
};

export default socketHandlers;
