        import express from 'express'
        import { Server } from 'socket.io';
        import {createServer} from 'http';
        import cors from 'cors';
        import bodyParser from 'body-parser';
        import http from 'http';
        const hostname = '192.168.128.197';
        const PORT = 5000;
        const app = express();
        app.use(cors({
            origin: ["http://localhost:8000","http://localhost:3000","http://192.168.242.197:3000", "http://192.168.128.197:8080"],
            methods: ["GET", "POST"],
            credentials: true,
        }))
        app.use(bodyParser.json());

        const server = createServer(app);
        const io = new Server(server, {
            cors:  {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        let connectedUsers = {};
        let notificationQueue = {};
        app.post('/receive-data', async (req, res) => {
            
           const message = await req.body;
        
            io.emit('notification', {message})
            res.send('Data received successfully');
            console.log('broadcast done successfully');
        });

        app.post('/recieve2Data', async (req,res)=>{
           
            const { userId, message } = await req.body;
            if(connectedUsers[userId]){
                io.to(userId).emit('new-notification', {id: userId, message});
                console.log('message sent succesfully');
                res.send('Notification sent succesfully');
            }
            else {
                queueNotification(userId, message);
                res.status(200).send('User not connected, notification Queued');
            }
        })
       
        io.on('connection', (socket) => {
            console.log('A user connected');
            console.log(socket.id);
           
            socket.on('joinRoom', (userId) => {
                connectedUsers[userId] = socket.id;
                socket.join(userId);
                console.log(`User with ID ${userId} joinded room ${userId}`);

                if(notificationQueue[userId]){
                    notificationQueue[userId].forEach(notification => {
                        io.to(userId).emit('new-notification', {id: userId, message: notification});
                    });
                    delete notificationQueue[userId];
                }

            });

            socket.on('leaveRoom', (userId)=> {
                delete connectedUsers[userId];
                socket.leave(userId);
                console.log(`User with ID ${userId} left room ${userId}`);
            })
          
            socket.on('disconnect', () => {
                for(let userId in connectedUsers){
                    if(connectedUsers[userId] === socket.id){
                        delete connectedUsers[userId];
                        console.log(`User with ID ${userId} disconnected`);
                        break;
                    }
                }
              //console.log('A user disconnected');
            });
          });
          function queueNotification(userId, message){
            if(!notificationQueue[userId]){
                notificationQueue[userId] = [];
            }
            notificationQueue[userId].push(message);
          }

          
        app.get("/", (req, res)=> {
            res.send("Hello Bhai");
        })

        server.listen(PORT, hostname, ()=> {
            console.log(`Server is Listening on ${PORT}`);
        })

