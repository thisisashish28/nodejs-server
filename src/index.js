import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import corsOptions from './config/corsOptions.js';
import rateLimiter from './middleware/rateLimiter.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import socketHandlers from './sockets/socketHandlers.js';

const PORT = 5000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

let connectedUsers = new Map();
let notificationQueue = new Map();

app.use(cors());
app.use(bodyParser.json());
app.use(rateLimiter);

// Routes
app.use('/receive-data', notificationRoutes(io, connectedUsers, notificationQueue));
app.use('/recieve2Data', userRoutes(io, connectedUsers, notificationQueue));
app.use('/receiveFlightIn', flightRoutes(io, connectedUsers, notificationQueue));

// Socket.io event handlers
io.on('connection', (socket) => {
    socketHandlers(socket, io, connectedUsers, notificationQueue);
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello Bhai");
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
