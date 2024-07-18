import express from 'express';

const router = express.Router();

const notificationRoutes = (io, connectedUsers, notificationQueue) => {
    router.post('/', (req, res) => {
        const { message } = req.body;
        io.emit('notification', { message });
        res.send('Data received successfully');
        console.log('Broadcast done successfully');
    });

    return router;
};

export default notificationRoutes;
