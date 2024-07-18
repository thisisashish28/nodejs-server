import express from 'express';

const router = express.Router();

const flightRoutes = (io, connectedUsers, notificationQueue) => {
    router.post('/', (req, res) => {
        const { user_email, message } = req.body;
        if (connectedUsers.has(user_email)) {
            io.to(connectedUsers.get(user_email)).emit('flight-information', { id: user_email, message });
            console.log('Flight information sent successfully', message, user_email);
            res.send('Flight information sent successfully');
        } else {
            queueNotification(user_email, message, notificationQueue);
            res.status(200).send('User not connected, information queued');
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

export default flightRoutes;
