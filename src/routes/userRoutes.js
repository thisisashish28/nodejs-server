import express from 'express';
import notifyBackend from '../utils/notifyBackend.js';

const router = express.Router();

const userRoutes = (io, connectedUsers, notificationQueue) => {
    router.post('/', async (req, res) => {
        const { userId, message } = req.body;
        if (connectedUsers.has(userId)) {
            io.to(connectedUsers.get(userId)).emit('new-notification', { id: userId, message });
            setTimeout(async () => {
                await notifyBackend(userId, message);
            }, 30000); // Delay of 30 seconds (30000 milliseconds)
            res.send('Notification sent successfully');
        } else {
            queueNotification(userId, message, notificationQueue);
            res.status(200).send('User not connected, notification queued');
        }
    });

    return router;
};

// Function to queue notifications
function queueNotification(userId, message, notificationQueue) {
    if (!notificationQueue.has(userId)) {
        notificationQueue.set(userId, []);
    }
    notificationQueue.get(userId).push(message);
}

export default userRoutes;
