// import express from 'express';
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import rateLimit from 'express-rate-limit';
// import http from 'http';
// import axios from 'axios';
//       // const hostname = '192.168.128.197';
// const PORT = 5000;
// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:8000", "http://localhost:3000", "http://192.168.242.197:3000", "http://192.168.128.197:8080"],
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// let connectedUsers = new Map();
// let notificationQueue = new Map();

// // Rate Limiting Configuration
// const limiter = rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.'
// });

// const notifyBackend = async (userId, message) => {
//     try {
//         const { data } = await axios.post('http://localhost:8000/api/notification-received', {
//             userId: userId,
//             message: message
//         });
//         console.log(data);
//         console.log('Backend notified successfully');
//     } catch (error) {
//         console.error('Error notifying backend:', error);
//     }
// };

// app.use(cors());
// app.use(bodyParser.json());

// // Apply rate limiter to specified endpoints
// app.use('/receive-data', limiter);
// app.use('/recieve2Data', limiter);
// app.use('/receiveFlightIn', limiter);

// // Endpoint to receive general notifications
// app.post('/receive-data', async (req, res) => {
//     const { message } = req.body;

//     io.emit('notification', { message });
//     res.send('Data received successfully');
//     console.log('Broadcast done successfully');
// });

// // Endpoint to receive notifications for a specific user
// app.post('/recieve2Data', async (req, res) => {
//     const { userId, message } = req.body;
//     if (connectedUsers.has(userId)) {
//         io.to(connectedUsers.get(userId)).emit('new-notification', { id: userId, message });
//         setTimeout(async () => {
//             await notifyBackend(userId, message);
//         }, 30000); // Delay of 30 seconds (30000 milliseconds)
//         res.send('Notification sent successfully');
//     } else {
//         queueNotification(userId, message);
//         res.status(200).send('User not connected, notification queued');
//     }
// });

// // Endpoint to receive flight information notifications
// app.post('/receiveFlightIn', async (req, res) => {
//     const { user_email, message } = req.body;

//     if (connectedUsers.has(user_email)) {
//         io.to(connectedUsers.get(user_email)).emit('flight-information', { id: user_email, message });
//         console.log('Flight information sent successfully', message, user_email);
//         res.send('Flight information sent successfully');
//     } else {
//         queueNotification(user_email, message);
//         res.status(200).send('User not connected, information queued');
//     }
// });

// // Socket.io event handlers
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Join room event
//     socket.on('joinRoom', (userId) => {
//         try {
//             connectedUsers.set(userId, socket.id);
//             socket.join(userId);
//             console.log(`User with ID ${userId} joined room ${userId}`);

//             // Send queued notifications if any
//             if (notificationQueue.has(userId)) {
//                 notificationQueue.get(userId).forEach(notification => {
//                     io.to(socket.id).emit('new-notification', { id: userId, message: notification });
//                 });
//                 notificationQueue.delete(userId);
//             }
//         } catch (error) {
//             console.error('Error during joinRoom event:', error);
//         }
//     });

//     // Leave room event
//     socket.on('leaveRoom', (userId) => {
//         connectedUsers.delete(userId);
//         socket.leave(userId);
//         console.log(`User with ID ${userId} left room ${userId}`);
//     });

//     // Disconnect event
//     socket.on('disconnect', () => {
//         for (let [userId, socketId] of connectedUsers.entries()) {
//             if (socketId === socket.id) {
//                 connectedUsers.delete(userId);
//                 console.log(`User with ID ${userId} disconnected`);
//                 break;
//             }
//         }
//     });
// });

// // Function to queue notifications
// function queueNotification(userId, message) {
//     if (!notificationQueue.has(userId)) {
//         notificationQueue.set(userId, []);
//     }
//     notificationQueue.get(userId).push(message);
// }

// // Default route
// app.get("/", (req, res) => {
//     res.send("Hello Bhai");
// });

// // Start server
// server.listen(PORT, () => {
//     console.log(`Server is listening on ${PORT}`);
// });


//         // /recieve2Data 